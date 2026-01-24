import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage, languages } from '../../store/language';

const Header = () => {
  const [showLang, setShowLang] = useState(false);
  const { lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-500">FlickReels</h1>
        <div className="relative">
          <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-2 text-zinc-300 hover:text-white">
            <Globe size={20} />
            <span className="text-sm">{languages.find(l => l.code === lang)?.name}</span>
          </button>
          {showLang && (
            <div className="absolute right-0 top-full mt-2 bg-zinc-900 rounded-lg shadow-lg py-2 min-w-32">
              {languages.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setShowLang(false); }} className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 ${lang === l.code ? 'text-red-500' : 'text-zinc-300'}`}>
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
