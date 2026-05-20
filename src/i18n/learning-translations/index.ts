import { caLearningTranslations } from "./ca";
import { esLearningTranslations } from "./es";
import { enLearningTranslations } from "./en";
import { itLearningTranslations } from "./it";

const translations: Record<string, Record<string, string>> = {
  ca: caLearningTranslations,
  es: esLearningTranslations,
  en: enLearningTranslations,
  it: itLearningTranslations,
};

export function getLearningTranslations(locale: string) {
  return translations[locale] || translations["ca"];
}

export type LearningTranslations = typeof caLearningTranslations;