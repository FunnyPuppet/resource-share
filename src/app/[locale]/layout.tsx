import type { Metadata } from 'next';
import {notFound} from 'next/navigation';
import {Locale, hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {clsx} from 'clsx';
import {Inter} from 'next/font/google';
import {routing} from '@/i18n/routing';

const inter = Inter({subsets: ['latin']});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type LayoutProps = {
  children: React.ReactNode,
  params: { locale: string }
}

export async function generateMetadata(
  props: LayoutProps
): Promise<Metadata> {
  const {locale} = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'Metadata'
  });

  return {
    title: `DataForge - ${t('title')}`,
    description: t('description')
  };
}

export default async function LocaleLayout({
  children,
  params
}: LayoutProps) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html className="h-full" lang={locale}>
      <body className={clsx(inter.className, 'flex h-full flex-col')}>
        <NextIntlClientProvider>
          {children}
          <footer className='flex justify-between items-center border-t border-gray-200 px-20 mt-10 py-5'>
            <div>
              © DataForge. All rights reserved.
            </div>
            <div>
              <a href='/en' className='text-gray-500 hover:text-blue-300'>English</a> / <a href='/zh' className='text-gray-500 hover:text-blue-300'>中文</a>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}