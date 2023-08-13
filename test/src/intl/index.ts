import { createTranslations } from "@customic/intl";

export const translations = await createTranslations({
  defaultLocale: "en",
  locales: async () =>
    ({
      // https://github.com/microsoft/TypeScript/issues/32063
      // as const is useless
      en: await import("./en.json"),
      de: await import("./de.json"),
    }) as const,
});
