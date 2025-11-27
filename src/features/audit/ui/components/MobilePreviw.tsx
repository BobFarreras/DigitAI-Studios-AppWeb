import Image from 'next/image';

export function MobilePreview({ screenshot }: { screenshot: string }) {
  if (!screenshot) return null;
  
  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="text-xl font-bold text-white mb-6">Vista Prèvia Mòbil</h2>
      {/* Mockup Minimalista Fosc */}
      <div className="relative border-slate-800 bg-slate-900 border-[10px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl shadow-black">
         <div className="h-[32px] w-[3px] bg-slate-800 absolute -start-[13px] top-[72px] rounded-s-lg"></div>
         <div className="h-[46px] w-[3px] bg-slate-800 absolute -start-[13px] top-[124px] rounded-s-lg"></div>
         <div className="h-[46px] w-[3px] bg-slate-800 absolute -start-[13px] top-[178px] rounded-s-lg"></div>
         <div className="h-[64px] w-[3px] bg-slate-800 absolute -end-[13px] top-[142px] rounded-e-lg"></div>
         <div className="rounded-[2rem] overflow-hidden w-[280px] h-[580px] bg-black">
            <Image
                src={screenshot}
                alt="Mobile Screenshot"
                width={280}
                height={580}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                unoptimized
            />
         </div>
      </div>
    </div>
  );
}