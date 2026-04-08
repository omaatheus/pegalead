import Link from "next/link";

export function SocialButton({ href, ariaLabel, svg }: { href: string; ariaLabel: string; svg: React.ReactNode }) {
    return (
        <Link 
            href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2.5 rounded-xl bg-slate-800/30 text-slate-400 border border-slate-700/50 hover:bg-[#FACC15]/10 hover:text-[#FACC15] hover:border-[#FACC15]/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
              aria-label={ariaLabel}
            >
            {svg}
            </Link>
    )
}