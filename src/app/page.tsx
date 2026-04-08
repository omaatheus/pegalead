import LeadCaptureForm from '@/components/forms/LeadCaptureForm';

export default function Home() {
  return ( 
    <main className="flex-grow w-full relative flex flex-col items-center pt-32 pb-12 px-4 sm:px-8 bg-[#060d1a] overflow-x-clip">
      
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FACC15]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 my-auto max-w-xl w-full bg-[#0a1526]/60 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl p-8 sm:p-10 transition-all">
        
        <div className="w-full">
          <LeadCaptureForm />
        </div>

      </div>

      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
    </main>
  );
}