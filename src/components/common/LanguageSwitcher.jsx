import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2">
        <Globe size={20} className="text-white" />
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-green-700 text-white px-3 py-1 rounded border-none focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.native}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;