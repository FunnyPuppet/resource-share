import {Locale, useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import FilePickerWithConfirm from '@/components/SubmitTask';
import {use} from 'react';

export default function IndexPage({params}: PageProps<'/[locale]'>) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale as Locale);

  const t = useTranslations();

  return (
    <main>
      <div className='mt-10 flex flex-col'>
        <div className='flex items-center justify-center'>
          <img src="/images/logo.png" alt="Logo" width="70" height="70"></img>
          <h1 className="text-6xl font-bold text-center">Data Forge</h1>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='mt-5 mb-10 text-center text-gray-500'>
            {t('Metadata.title')}
          </span>

          <span className='w-[30%] text-center text-gray-500'>
            {t('Metadata.description')}
          </span>
        </div>
      </div>
      
      <div className='mb-10'>
        <FilePickerWithConfirm></FilePickerWithConfirm>
      </div>

      <div className='w-full flex flex-col justify-center items-center'>
        <div className='w-[80%] rounded-lg border border-gray-300 p-5 focus:outline-none focus:ring-2 focus:ring-indigo-300'>
          <h2 className="text-3xl font-semibold text-center">{t('FAQ.title')}</h2>

          <div className='w-full flex justify-between gap-4'>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q1')}</p>

              <span className="text-center text-gray-500">{t('FAQ.questions.t1')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q2')}</p>

              <span className="text-center text-gray-500">{t('FAQ.questions.t2')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q3')}</p>

              <span className="text-center text-gray-500">{t('FAQ.questions.t3')}</span>
            </div>
          </div>

          <div className='w-full flex justify-between gap-4'>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q4')}</p>

              <span className="text-center text-gray-500">{t('FAQ.questions.t4')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q5')}</p>

              <span className="text-center text-gray-500">{t('FAQ.questions.t5')}</span>
            </div>
            <div className='w-full p-5 flex flex-col items-center'>
              <p className="text-xl font-medium text-center mb-5">{t('FAQ.questions.q6')}</p>

              <span className="text-center text-gray-500">{t('FAQ.questions.t6')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
  );
}