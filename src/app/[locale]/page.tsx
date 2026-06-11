import { Locale } from 'next-intl';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type PageProps = {
  params: Promise<any>
}

export default async function IndexPage({ params }: PageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale as Locale);

  const t = await getTranslations();

  return (
    <main className='w-full relative z-10'>
      {/* ========== Hero 区域 ========== */}
      <div className='relative mt-10 sm:mt-16 flex flex-col px-4'>
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent hidden sm:block"></div>

        {/* Logo + Title */}
        <div className='flex items-center justify-center gap-3 sm:gap-5'>
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-cyan-400/20 animate-glow-pulse"></div>
            <img
              src="/images/logo.png"
              alt="Logo"
              className='relative w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)] animate-float'
            />
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold text-center bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-text-glow tracking-tight">
            Data Forge
          </h1>
        </div>

        {/* Subtitle */}
        <div className='flex flex-col items-center justify-center mx-1 sm:mx-0 mt-6'>
          <span className='text-lg sm:text-xl text-center text-cyan-200/80 font-medium tracking-wide'>
            {t('Metadata.title')}
          </span>

          <span className='mt-4 w-full sm:w-[40%] text-center text-blue-200/50 text-sm sm:text-base leading-relaxed'>
            {t('Metadata.description')}
          </span>
        </div>
      </div>

      {/* ========== 开始按钮 ========== */}
      <div className='relative mb-24 mt-12 sm:mt-16'>
        {/* 按钮外围光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-glow-pulse"></div>

        <div className='flex flex-col items-center justify-center relative z-10'>
          <Link
            href="/generate"
            className="btn-tech group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-16 py-5 text-2xl sm:text-3xl font-bold text-white shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,240,255,0.5)] hover:scale-105 active:scale-95"
          >
            {/* Hover 叠加光 */}
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

            {/* 顶部高光 */}
            <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>

            {/* 扫描线 */}
            <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('Process.startBtn')}
            </span>
          </Link>
        </div>
      </div>

      {/* ========== 亮点介绍 ========== */}
      <div className='flex flex-col justify-center items-center mb-16 sm:mb-24 mx-2 sm:mx-0 px-4'>
        <div className='scan-line rounded-2xl border border-cyan-500/20 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-12 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,240,255,0.1)] w-full max-w-3xl'>
          {/* Section header with decorative line */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent max-w-16"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {t('HLS.title')}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent max-w-16"></div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
            {/* Card 1 */}
            <div className='card-hover group w-full p-5 sm:p-6 flex flex-col items-center rounded-xl border border-cyan-500/10 bg-white/[0.02] backdrop-blur-sm hover:border-cyan-400/50 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]'>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-shadow">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-center mb-3 text-cyan-100">{t('HLS.contents.t1')}</p>
              <span className="text-center text-blue-200/50 text-sm leading-relaxed">{t('HLS.contents.c1')}</span>
            </div>

            {/* Card 2 */}
            <div className='card-hover group w-full p-5 sm:p-6 flex flex-col items-center rounded-xl border border-purple-500/10 bg-white/[0.02] backdrop-blur-sm hover:border-purple-400/50 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]'>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/30 mb-4 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-shadow">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-center mb-3 text-purple-100">{t('HLS.contents.t2')}</p>
              <span className="text-center text-blue-200/50 text-sm leading-relaxed">{t('HLS.contents.c2')}</span>
            </div>

            {/* Card 3 */}
            <div className='card-hover group w-full p-5 sm:p-6 flex flex-col items-center rounded-xl border border-blue-500/10 bg-white/[0.02] backdrop-blur-sm hover:border-blue-400/50 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30 mb-4 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-shadow">
                <span className="text-2xl">🔐</span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-center mb-3 text-blue-100">{t('HLS.contents.t3')}</p>
              <span className="text-center text-blue-200/50 text-sm leading-relaxed">{t('HLS.contents.c3')}</span>
            </div>

            {/* Card 4 */}
            <div className='card-hover group w-full p-5 sm:p-6 flex flex-col items-center rounded-xl border border-pink-500/10 bg-white/[0.02] backdrop-blur-sm hover:border-pink-400/50 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]'>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-500/10 border border-pink-500/30 mb-4 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-shadow">
                <span className="text-2xl">🌐</span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-center mb-3 text-pink-100">{t('HLS.contents.t4')}</p>
              <span className="text-center text-blue-200/50 text-sm leading-relaxed">{t('HLS.contents.c4')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FAQ 区域 ========== */}
      <div className='flex flex-col justify-center items-center mb-20 sm:mb-32 mx-2 sm:mx-0 px-4'>
        <div className='rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-12 transition-all duration-500 hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)] w-full max-w-4xl'>
          {/* Section header */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent max-w-16"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
              {t('FAQ.title')}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent max-w-16"></div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
            {/* FAQ Card 1 */}
            <div className='card-hover group w-full p-5 flex flex-col items-center rounded-xl border border-purple-500/10 bg-white/[0.02] hover:border-purple-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]'>
              <p className="text-base sm:text-lg font-semibold text-center mb-3 text-purple-200">{t('FAQ.questions.q1')}</p>
              <span className="text-center text-blue-200/40 text-sm leading-relaxed">{t('FAQ.questions.t1')}</span>
            </div>

            {/* FAQ Card 2 */}
            <div className='card-hover group w-full p-5 flex flex-col items-center rounded-xl border border-cyan-500/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]'>
              <p className="text-base sm:text-lg font-semibold text-center mb-3 text-cyan-200">{t('FAQ.questions.q2')}</p>
              <span className="text-center text-blue-200/40 text-sm leading-relaxed">{t('FAQ.questions.t2')}</span>
            </div>

            {/* FAQ Card 3 */}
            <div className='card-hover group w-full p-5 flex flex-col items-center rounded-xl border border-blue-500/10 bg-white/[0.02] hover:border-blue-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]'>
              <p className="text-base sm:text-lg font-semibold text-center mb-3 text-blue-200">{t('FAQ.questions.q3')}</p>
              <span className="text-center text-blue-200/40 text-sm leading-relaxed">{t('FAQ.questions.t3')}</span>
            </div>

            {/* FAQ Card 4 */}
            <div className='card-hover group w-full p-5 flex flex-col items-center rounded-xl border border-pink-500/10 bg-white/[0.02] hover:border-pink-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]'>
              <p className="text-base sm:text-lg font-semibold text-center mb-3 text-pink-200">{t('FAQ.questions.q4')}</p>
              <span className="text-center text-blue-200/40 text-sm leading-relaxed">{t('FAQ.questions.t4')}</span>
            </div>

            {/* FAQ Card 5 */}
            <div className='card-hover group w-full p-5 flex flex-col items-center rounded-xl border border-emerald-500/10 bg-white/[0.02] hover:border-emerald-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'>
              <p className="text-base sm:text-lg font-semibold text-center mb-3 text-emerald-200">{t('FAQ.questions.q5')}</p>
              <span className="text-center text-blue-200/40 text-sm leading-relaxed">{t('FAQ.questions.t5')}</span>
            </div>

            {/* FAQ Card 6 */}
            <div className='card-hover group w-full p-5 flex flex-col items-center rounded-xl border border-orange-500/10 bg-white/[0.02] hover:border-orange-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]'>
              <p className="text-base sm:text-lg font-semibold text-center mb-3 text-orange-200">{t('FAQ.questions.q6')}</p>
              <span className="text-center text-blue-200/40 text-sm leading-relaxed">{t('FAQ.questions.t6')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Footer ========== */}
      <footer className='relative border-t border-white/5 py-8 px-4'>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-blue-200/30 text-sm">
            © DataForge. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <a href='/en' className='text-blue-200/40 hover:text-cyan-300 transition-colors'>English</a>
            <span className='text-blue-200/20'>/</span>
            <a href='/zh' className='text-blue-200/40 hover:text-cyan-300 transition-colors'>中文</a>
          </div>
        </div>
      </footer>
    </main>
  );
}