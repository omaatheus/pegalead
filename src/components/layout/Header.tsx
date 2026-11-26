'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060d1a]/80 backdrop-blur-md border-b border-slate-800/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="Zions Vision Logo" 
                width={160} 
                height={48} 
                className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <Link href="https://zionsvision.com/sobre-a-zions/" target="_blank" className="group relative py-2">
              <span className="text-sm font-semibold tracking-wide text-slate-300 group-hover:text-slate-50 transition-colors duration-300">
                Sobre a Zions
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FACC15] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>

            <Link 
              href="/contact" 
              className="text-sm font-semibold tracking-wide text-slate-50 border border-slate-700/80 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(250,204,21,0.1)]"
            >
              Contato
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-[#FACC15] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FACC15]/50 transition-colors"
              aria-label="Abrir menu principal"
            >
              {isMobileMenuOpen ? (
                <X className="h-7 w-7" strokeWidth={2} />
              ) : (
                <Menu className="h-7 w-7" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-[#0a1526]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <nav className="flex flex-col px-4 space-y-2">
          <Link 
            href="https://zionsvision.com/sobre-a-zions/" 
            target='_blank'
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-[#FACC15] hover:bg-slate-800/50 transition-colors"
          >
            Sobre a Zions
          </Link>
          
          <Link 
            href="/contact" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-lg text-base font-medium text-[#FACC15] hover:bg-[#FACC15]/10 transition-colors"
          >
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}