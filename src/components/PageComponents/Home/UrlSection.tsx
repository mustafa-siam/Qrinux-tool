"use client";

import Image from "next/image";
import { useState } from "react";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase"; 
import { toast } from "react-toastify";

const UrlSection = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) return;

    setIsLoading(true);
    const supabase = createClient();
    const shortCode = nanoid(6);

    try {
      // id, user_id, and clicks are handled by database defaults
      const { error } = await supabase
        .from("urls")
        .insert([
          { 
            long_url: longUrl, 
            short_code: shortCode 
          }
        ]);

      if (error) throw error;

      const fullShortUrl = `${window.location.origin}/${shortCode}`;
      setShortUrl(fullShortUrl);
      setLongUrl(""); 
      toast.success("🚀 Link shortened successfully!");

    } catch (error: any) {
      console.error("Supabase Error:", error);
      // Policy errors now visible via toast thanks to your RLS updates
      toast.error(error.message || "Failed to shorten URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast.info("📋 Copied to clipboard!");
  };

  return (
    <section className="relative mt-20 px-6 py-12 bg-black overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#D670FF] opacity-10 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#00F0FF] opacity-10 blur-[120px]" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-left z-10">
          <h2 className="text-4xl lg:text-7xl text-white font-extrabold mb-6">
            The only <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D670FF] to-[#00F0FF]">URL Shortener</span> <br /> 
            you&rsquo;ll ever need! 
          </h2>
          
          <form
            onSubmit={handleShorten}
            className="relative flex flex-col sm:flex-row w-full max-w-2xl gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <input
              type="url"
              placeholder="Paste your loooong URL here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="flex-1 bg-transparent py-4 px-6 text-white outline-none focus:ring-0 placeholder:text-gray-500"
              required
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-[#D670FF] to-[#00F0FF] rounded-xl font-bold text-black hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Shortening..." : "Shorten!"}
            </button>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 border border-[#00F0FF]/30 bg-[#00F0FF]/5 rounded-xl flex items-center justify-between max-w-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">Your new link</span>
                <span className="text-[#00F0FF] font-mono break-all">{shortUrl}</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className="ml-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 relative group">
          <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/banner1.png"
              alt="Tooltify UI Preview"
              width={600}
              height={500}
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrlSection;