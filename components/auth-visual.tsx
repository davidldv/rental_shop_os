'use client';

import { useTranslations } from 'next-intl';

export function AuthVisual() {
  const t = useTranslations('Components.AuthVisual');
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-87.5 space-y-4">
      {/* Abstract card representing a booking request */}
      <div className="relative rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md transition-all hover:scale-[1.02] duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
               <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-white">{t('bookingConfirmed')}</div>
              <div className="text-xs text-white/50">{t('justNow')}</div>
            </div>
          </div>
          <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400">
            #ORD-4921
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
           <div className="h-2 w-2/3 rounded-full bg-white/10" />
           <div className="h-2 w-1/2 rounded-full bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-2">
           <div className="rounded-lg bg-black/20 p-2 border border-white/5">
              <div className="text-[10px] text-white/40 mb-1">{t('items')}</div>
              <div className="text-sm font-medium text-white">{t('itemsValue')}</div>
           </div>
           <div className="rounded-lg bg-black/20 p-2 border border-white/5">
              <div className="text-[10px] text-white/40 mb-1">{t('total')}</div>
              <div className="text-sm font-medium text-white">$450.00</div>
           </div>
        </div>
      </div>

       {/* Floating element behind */}
       <div className="absolute -z-10 top-4 -right-4 w-full h-full rounded-xl border border-white/5 bg-white/5 blur-sm opacity-50 rotate-3 transition-transform duration-700" />
    </div>
  )
}
