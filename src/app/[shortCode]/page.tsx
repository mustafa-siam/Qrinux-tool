import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = params;
  const supabase = createClient();

  // 1. Find the long URL in your "Physical" table
  const { data, error } = await supabase
    .from("urls")
    .select("long_url, clicks")
    .eq("short_code", shortCode)
    .single();

  
  if (error || !data) {
    redirect("/");
  }

  await supabase
    .from("urls")
    .update({ clicks: data.clicks + 1 })
    .eq("short_code", shortCode);

  
  redirect(data.long_url);
}