import { createTranslations } from "@customic/intl";

export const translations = await createTranslations({
  defaultLocale: "en",
  locales: async () =>
  ({
    en: {
      locale: "en",
      test: "hello",
      pech: "lol",
    },
    de: {
      locale: "de",
      test: "hallo",
    },
  }) as const,
});
