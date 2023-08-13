import { cookies as NextCookies, headers as NextHeaders } from "next/headers";
import { getLocale } from "./locale";
import { IntlMessageFormat } from "intl-messageformat";
import { optic_, get } from "optics-ts";
import { Simplify, Split, ValueOf } from "type-fest";

type LocaleEntry = string | { [key: string]: LocaleEntry };

type LocaleMap = Record<
  string,
  {
    /**
     * IETF BCP 47 language tag
     */
    locale: string;
    [key: string]: LocaleEntry;
  }
>;

type TraverseObject<
  Keys extends string[],
  Object extends Record<string, any>,
> = Keys extends [infer key, ...infer rest]
  ? key extends keyof Object
    ? Object[key] extends Record<string, any>
      ? rest extends string[]
        ? TraverseObject<rest, Object[key]>
        : never
      : Object[key]
    : undefined
  : Object;

type TraverseLocaleMap<
  Keys extends string[],
  Locales extends LocaleMap,
> = ValueOf<{
  [K in keyof Locales]: TraverseObject<Keys, Locales[K]>;
}>;

/*
type DeepKeys<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends object
    ? `${K}.${DeepKeys<T[K]>}`
    : `${K}`;
}[keyof T];
*/

const createTranslations = async <
  const Locales extends LocaleMap | (() => Promise<LocaleMap>),
  UnwrappedLocales extends Locales extends LocaleMap
    ? Locales
    : Locales extends () => Promise<infer P>
    ? P
    : never,
>({
  ...config
}: {
  defaultLocale: keyof UnwrappedLocales;
  locales: Locales;
}) => {
  const availableLocales =
    typeof config.locales === "function"
      ? await config.locales()
      : (config.locales as LocaleMap);
  const localeKeys = Object.keys(availableLocales);
  const defaultLocale = config.defaultLocale as string;
  return ({
    headers,
    cookies,
  }: {
    headers: typeof NextHeaders;
    cookies: typeof NextCookies;
  }) => {
    const locale = getLocale(headers(), cookies(), localeKeys, defaultLocale);
    const localeData = availableLocales[locale];
    const localeKey = localeData.locale;

    return <Key extends string>(
      key: Key,
      //values?: Record<string, any>
    ): TraverseLocaleMap<Split<Key, ".">, UnwrappedLocales> => {
      const optic = optic_().path(key);
      const msgRaw = get(optic)(localeData);
      if (typeof msgRaw !== "string")
        throw new Error("Message is not a string");
      const msg = new IntlMessageFormat(msgRaw, localeKey);
      return msgRaw as TraverseLocaleMap<Split<Key, ".">, UnwrappedLocales>;
    };
  };
};

// Starting here, this is just for testing
// I can write whatever I want in here because it does not get exported and thus, does not end up in the bundle

type CreateTranslations = <
  const Locales extends LocaleMap | (() => Promise<LocaleMap>),
  const UnwrappedLocales extends Locales extends LocaleMap
    ? Locales
    : Locales extends () => Promise<LocaleMap>
    ? Awaited<ReturnType<Locales>>
    : never,
>(config: {
  defaultLocale: keyof UnwrappedLocales;
  locales: Locales;
}) => Promise<
  ({
    headers,
    cookies,
  }: {
    headers: typeof NextHeaders;
    cookies: typeof NextCookies;
  }) => <Key extends string>(
    key: Key,
  ) => TraverseLocaleMap<Split<Key, ".">, UnwrappedLocales>
>;
declare const a: CreateTranslations;

const _ = async () => {
  const translator = await a({
    defaultLocale: "de",
    locales: async () =>
      ({
        en: {
          locale: "en",
          test: "hello",
          enOnly: "english",
        },
        de: {
          locale: "de",
          test: "hallo",
          deOnly: "deutsch",
        },
      }) as const,
  });

  const t = translator({
    headers: null as unknown as typeof NextHeaders,
    cookies: null as unknown as typeof NextCookies,
  });

  const union = t("test");
  //    ^?
  type Union = Simplify<typeof union>;
  //    ^?

  const possiblyUndefined = t("deOnly");
  //    ^?
  type PossibleUndefined = Simplify<typeof possiblyUndefined>;
  //    ^?
};

export { createTranslations };
