// app/[shortCode]/page.tsx

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  // Wait for params in Next.js 15+ (if applicable)
  const { shortCode } = await params; 
  const supabase = createClient();

  const { data, error } = await supabase
    .from("urls")
    .select("long_url, clicks")
    .eq("short_code", shortCode)
    .single();

  if (error || !data) {
    redirect("/");
  }

  // Increment clicks (Non-blocking)
  await supabase
    .from("urls")
    .update({ clicks: (data.clicks || 0) + 1 })
    .eq("short_code", shortCode);

  // ENSURE THE URL HAS A PROTOCOL
  let targetUrl = data.long_url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }

  redirect(targetUrl);
}