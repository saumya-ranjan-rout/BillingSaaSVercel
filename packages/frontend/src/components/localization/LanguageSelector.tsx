import React from 'react';
import { useRouter } from 'next/router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

interface LanguageSelectorProps {
  languages: Language[];
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, className = '' }) => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const changeLanguage = async (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (!language) return;

    await i18n.changeLanguage(languageCode);
    
    // Update document direction for RTL languages
    document.documentElement.dir = language.direction;
    document.documentElement.lang = languageCode;
    
    // Update Next.js router locale
    router.push(router.pathname, router.asPath, { locale: languageCode });
  };

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className={`w-auto ${className}`}>
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center">
              <span className="mr-2">{language.nativeName}</span>
              <span className="text-muted-foreground">({language.name})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
