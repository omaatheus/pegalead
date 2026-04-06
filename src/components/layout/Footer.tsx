import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060d1a] border-t border-slate-800/80 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="inline-block group">
              <Image 
                src="/logo.png" 
                alt="Zions Vision Logo" 
                width={140} 
                height={42} 
                className="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]"
              />
            </Link>
            <p className="text-sm text-slate-500 font-medium tracking-wide">
              © {currentYear} Zions Vision. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex items-center gap-4">
            
            <Link 
              href="https://instagram.com/zions.vision" 
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2.5 rounded-xl bg-slate-800/30 text-slate-400 border border-slate-700/50 hover:bg-[#FACC15]/10 hover:text-[#FACC15] hover:border-[#FACC15]/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              aria-label="Acessar Instagram"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 transition-transform group-hover:scale-110"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            
            <Link 
              href="https://www.linkedin.com/company/zionsvision/" 
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2.5 rounded-xl bg-slate-800/30 text-slate-400 border border-slate-700/50 hover:bg-[#1e40af]/20 hover:text-blue-400 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              aria-label="Acessar LinkedIn"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 transition-transform group-hover:scale-110"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}