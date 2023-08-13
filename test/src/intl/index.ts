import { createTranslations } from "@customic/intl";

export const translations = await createTranslations({
  defaultLocale: "en",
  locales: async () =>
    ({
      en: await import("./en.json"),
      de: await import("./de.json"),
    }) as const,
});
