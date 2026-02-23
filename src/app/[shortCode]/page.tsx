import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

// Server Component
export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortCode } = params;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("urls")
    .select("long_url, clicks")
    .eq("short_code", shortCode)
    .single();

  if (error || !data) {
    // If code not found, go to homepage
    redirect("/");
  }

  // Update clicks
  await supabase
    .from("urls")
    .update({ clicks: data.clicks + 1 })
    .eq("short_code", shortCode);

  // Redirect to external link
  redirect(data.long_url);
}