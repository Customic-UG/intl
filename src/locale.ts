import { cookies as nextCookies, headers as nextHeaders } from "next/headers";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export const getLocale = <T extends string[]>(
  headers: ReturnType<typeof nextHeaders>,
  cookies: ReturnType<typeof nextCookies>,
  locales: T,
  defaultLocale: T[number]
): T[number] => {
  const languages = new Negotiator({
    headers: {
      "accept-language": headers.get("accept-language") || undefined,
    },
  }).languages();

  return match(languages, locales, defaultLocale);
};
