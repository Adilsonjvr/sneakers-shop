'use client';

import { useLanguage } from '@/components/i18n/LanguageProvider';

const LANG_OPTIONS = [
  { value: 'pt', label: 'PT' },
  { value: 'en', label: 'EN' },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex rounded-full border border-white/15 bg-white/5 text-xs font-semibold uppercase">
      {LANG_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          className={`px-3 py-1 transition ${
            lang === option.value ? 'text-black' : 'text-white/60'
          }`}
          style={{
            backgroundColor: lang === option.value ? 'white' : 'transparent',
            borderRadius:
              option.value === 'pt' ? '999px 0 0 999px' : '0 999px 999px 0',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
