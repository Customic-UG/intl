import { translations } from "@/intl";
import { cookies, headers } from "next/headers";
import { Simplify } from "type-fest";

export default async function Home() {
  const t = translations({ headers, cookies });
  const string = t("locale");
  type T = Simplify<typeof string>;
  //   ^?
  return (
    <main
      style={{
        height: "100dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      {t("locale")}
    </main>
  );
}
