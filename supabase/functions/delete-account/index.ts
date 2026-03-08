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

    const userId = userData.user.id;
    console.log(`[DELETE-ACCOUNT] Deleting all data for user ${userId}`);

    // Delete community reactions first (foreign key constraint)
    const { error: reactionsError } = await supabaseClient
      .from("community_reactions")
      .delete()
      .eq("user_id", userId);
    if (reactionsError) console.error("Error deleting reactions:", reactionsError);

    // Delete community posts
    const { error: postsError } = await supabaseClient
      .from("community_posts")
      .delete()
      .eq("user_id", userId);
    if (postsError) console.error("Error deleting posts:", postsError);

    // Delete the auth user (this is the final step — cascades profile data)
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(userId);
    if (deleteUserError) throw new Error(`Failed to delete user: ${deleteUserError.message}`);

    console.log(`[DELETE-ACCOUNT] Successfully deleted user ${userId}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[DELETE-ACCOUNT] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
