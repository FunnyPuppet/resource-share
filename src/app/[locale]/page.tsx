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
    <main className='w-full'>
      <div className='mt-10 flex flex-col'>
        <div className='flex items-center justify-center'>
          <img src="/images/logo.png" alt="Logo" className='w-[40px] h-[40px] sm:w-[70px] sm:h-[70px]'></img>
          <h1 className="text-3xl sm:text-6xl font-bold text-center">Data Forge</h1>
        </div>
        <div className='flex flex-col items-center justify-center mx-1 sm:mx-0'>
          <span className='mt-5 mb-10 text-center text-gray-500'>
            {t('Metadata.title')}
          </span>

          <span className='w-full sm:w-[30%] text-center text-gray-500'>
            {t('Metadata.description')}
          </span>
        </div>
      </div>

      <div className='mb-20 mt-10'>
        <div className='flex flex-col items-center justify-center'>
          <Link
            href="/generate"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-12 py-4 text-3xl text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

            <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent"></span>

            <span className="relative z-10 flex items-center gap-2">
              {t('Process.startBtn')}
            </span>
          </Link>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center mb-10 mx-1 sm:mx-0 sm:mb-20'>
        <div className='rounded-2xl shadow-md border border-gray-100 p-10 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl w-full sm:w-[40%]'>
          <h2 className="text-3xl font-semibold text-center mb-10">{t('HLS.title')}</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='w-full p-2 sm:p-5 flex flex-col items-center'>
              <p className="text-2xl font-medium text-center mb-5">💡 {t('HLS.contents.t1')}</p>

              <span className="text-center text-gray-500">{t('HLS.contents.c1')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-2xl font-medium text-center mb-5">⚡ {t('HLS.contents.t2')}</p>

              <span className="text-center text-gray-500">{t('HLS.contents.c2')}</span>
            </div>

            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-2xl font-medium text-center mb-5">🔐 {t('HLS.contents.t3')}</p>

              <span className="text-center text-gray-500">{t('HLS.contents.c3')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-2xl font-medium text-center mb-5">🌐 {t('HLS.contents.t4')}</p>

              <span className="text-center text-gray-500">{t('HLS.contents.c4')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center mb-10 mx-1 sm:mx-0 sm:mb-20'>
        <div className='rounded-2xl shadow-md border border-gray-100 p-10 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl w-full sm:w-[60%]'>
          <h2 className="text-3xl font-semibold text-center mb-10">{t('FAQ.title')}</h2>

          <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2'>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q1')}</p>

              <span className="text-center text-gray-500 leading-relaxed">{t('FAQ.questions.t1')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q2')}</p>

              <span className="text-center text-gray-500 leading-relaxed">{t('FAQ.questions.t2')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q3')}</p>

              <span className="text-center text-gray-500 leading-relaxed">{t('FAQ.questions.t3')}</span>
            </div>

            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q4')}</p>

              <span className="text-center text-gray-500 leading-relaxed">{t('FAQ.questions.t4')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q5')}</p>

              <span className="text-center text-gray-500 leading-relaxed">{t('FAQ.questions.t5')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q6')}</p>

              <span className="text-center text-gray-500 leading-relaxed">{t('FAQ.questions.t6')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

  );
}