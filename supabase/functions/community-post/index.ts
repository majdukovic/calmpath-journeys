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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    const { content, display_name } = await req.json();
    if (!content || content.trim().length < 2) {
      throw new Error("Post content is too short");
    }
    if (content.length > 500) {
      throw new Error("Post content is too long (max 500 characters)");
    }

    // AI moderation check
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const moderationPrompt = `You are a content moderator for a supportive mental health community app called Breeze. Users share posts about anxiety, breathing exercises, gratitude, and mental wellness.

APPROVE posts that are:
- Sharing personal experiences with anxiety or mental health
- Asking for tips or support
- Celebrating small wins (e.g., "Did my breathing exercise today!")
- Expressing gratitude
- Offering encouragement to others
- General wellness questions

REJECT posts that contain:
- Self-harm or suicide content (direct threats or detailed methods)
- Bullying, harassment, or hateful language
- Spam, advertising, or links
- Explicit sexual content
- Personal information (phone numbers, addresses, full names)
- Medical advice presented as fact
- Promoting dangerous behaviors

Respond with ONLY one word: APPROVE or REJECT
If rejecting, add a brief reason on the next line.

Post to moderate:
"${content.replace(/"/g, '\\"')}"`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: moderationPrompt }],
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI moderation failed, auto-approving:", await aiResponse.text());
      // If AI is down, auto-approve (fail open for UX, but log it)
    }

    let isApproved = true;
    let rejectReason = "";

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const decision = (aiData.choices?.[0]?.message?.content || "APPROVE").trim();
      const lines = decision.split("\n");
      isApproved = lines[0].toUpperCase().includes("APPROVE");
      if (!isApproved && lines.length > 1) {
        rejectReason = lines.slice(1).join(" ").trim();
      }
    }

    if (!isApproved) {
      return new Response(JSON.stringify({
        success: false,
        rejected: true,
        reason: rejectReason || "This post doesn't meet our community guidelines. Please try rephrasing.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Insert the approved post using service role (bypasses RLS for is_approved)
    const { data: post, error: insertError } = await supabaseClient
      .from("community_posts")
      .insert({
        user_id: userData.user.id,
        display_name: display_name || "Anonymous",
        content: content.trim(),
        topic: "general",
        is_approved: true,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, post }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("community-post error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
