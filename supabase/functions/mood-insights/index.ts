import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    if (!userData.user) throw new Error("Not authenticated");

    // Get mood data from request body
    const { moodEntries, dailyCalmSessions, gratitudeEntries } = await req.json();

    if (!moodEntries?.length && !dailyCalmSessions?.length) {
      return new Response(JSON.stringify({
        insight: "Keep logging your mood and doing Daily Calms — once you have a week of data, I'll share personalized insights about your patterns.",
        hasEnoughData: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build a prompt from the user's data
    const moodSummary = (moodEntries || []).slice(0, 30).map((e: any) => 
      `${e.date}: ${e.moodLabel}${e.note ? ` (${e.note})` : ''} [${e.source}]`
    ).join('\n');

    const sessionDates = (dailyCalmSessions || []).slice(0, 30).map((s: any) => s.date).join(', ');
    const gratitudeSummary = (gratitudeEntries || []).slice(0, 10).map((e: any) =>
      `${e.date}: "${e.answer}" (${e.category})`
    ).join('\n');

    const prompt = `You are a gentle, warm wellness companion (like a caring therapist friend). Analyze this user's mood and activity data from a breathing/anxiety relief app. Give a brief, encouraging, personalized insight (3-4 sentences max). Focus on patterns, positive trends, or gentle suggestions. Never be clinical or cold. Use warm language.

MOOD LOG (recent):
${moodSummary || 'No mood entries yet'}

DAILY CALM SESSIONS (dates completed):
${sessionDates || 'No sessions yet'}

GRATITUDE ENTRIES (recent):
${gratitudeSummary || 'No entries yet'}

Write a warm, personalized insight. Mention specific patterns you notice (e.g., "You tend to feel better on days you practice breathing" or "Wednesdays seem harder — that's okay"). End with one small, specific suggestion.`;

    // Use Lovable AI via the gateway
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI gateway error [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const insight = aiData.choices?.[0]?.message?.content || "Keep breathing — your data is building a picture of your journey.";

    return new Response(JSON.stringify({
      insight,
      hasEnoughData: true,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("mood-insights error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
