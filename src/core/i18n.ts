import RNLocalize from 'react-native-localize';

type I18NSupportedLangs = 'uk' | 'en' | 'ru';

const getCurLang = (): I18NSupportedLangs => {
  const locs = RNLocalize.getLocales();
  const ukLangLocale = locs.find(itm => itm.languageCode === 'uk');
  if (ukLangLocale) return 'uk';
  const ruLangLocale = locs.find(itm => itm.languageCode === 'ru');
  if (ruLangLocale) return 'ru';
  const enLangLocale = locs.find(itm => itm.languageCode === 'en');
  if (enLangLocale) return 'en';
  return 'uk';
};

interface I18NObj<D> {
  uk: D;
  ru: D;
  en: D;
}

export const curLang = getCurLang();

export const i18n = <D>(val: I18NObj<D>): D => {
  switch (curLang) {
    case 'en':
      return val.en;
    case 'ru':
      return val.ru;
    case 'uk':
      return val.uk;
  }
};
