import { create } from 'zustand';

interface LanguageState {
  lang: string;
  setLang: (lang: string) => void;
}

export const languages = [
  { code: 'id', name: 'Indonesia' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
];

export const useLanguage = create<LanguageState>((set) => ({
  lang: 'id',
  setLang: (lang) => set({ lang }),
}));
