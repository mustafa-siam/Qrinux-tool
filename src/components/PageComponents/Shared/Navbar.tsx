"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ArrowLeft, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Supabase user
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isHomePage = pathname === '/';

  // 1️⃣ Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2️⃣ Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    // Optional: subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 3️⃣ Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    setUser(null);
    toast.info("Logged out successfully");
    router.push("/auth/login");
  };

  const navLinks = [
    { name: 'INDEX', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'SERVICES', href: '/services' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center px-4 pt-4 pointer-events-none">
        <nav className={`w-full max-w-7xl transition-all duration-500 border border-zinc-800/50 px-6 py-3 flex items-center justify-between glass-fancy pointer-events-auto ${isScrolled ? 'bg-black/90 py-2 border-yellow-400/40 shadow-2xl' : 'bg-transparent'}`}>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 group cursor-none flex-1"
          >
            <div className="flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-500 shrink-0 shadow-lg shadow-yellow-400/20">
              <Image src="/Tlogo.png" alt='logo' width={40} height={40} />
            </div>
            <span className="text-xl font-bold tracking-wider font-heading truncate">TOO<span className='text-[#9DFF91] tracking-wider'>LTIFY</span></span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            {isHomePage ? (
              navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 hover:text-yellow-400 transition-all relative group py-2"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-400 transition-all group-hover:w-full"></span>
                </Link>
              ))
            ) : (
              <Link 
                href="/"
                className="text-[11px] font-black tracking-[0.2em] text-yellow-400 hover:text-zinc-200 transition-all flex items-center gap-3 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                BACK TO INDEX
              </Link>
            )}
          </div>

          {/* Conditional Login / Logout */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-5 py-2 border border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-95"
              >
                LOGOUT <LogOut size={12} />
              </button>
            ) : (
              <Link 
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2 border border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all active:scale-95"
              >
                LOGIN <ArrowUpRight size={12} className="hidden lg:block" />
              </Link>
            )}

            <button 
              className="p-2 text-zinc-400 hover:text-yellow-400 transition-colors md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-8 md:hidden"
          >
            <button 
              className="absolute top-8 right-8 text-zinc-500 hover:text-zinc-200 p-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-bold font-heading tracking-tighter hover:text-yellow-400 transition-colors text-zinc-200 text-center uppercase"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="mt-8 px-12 py-4 bg-yellow-400 text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-400/20 block text-center"
                  >
                    LOGOUT
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-8 px-12 py-4 bg-yellow-400 text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-400/20 block text-center"
                  >
                    LOGIN
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;