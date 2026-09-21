import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLang } from "../i18n";

export default function NotFound() {
  const { t, path } = useLang();
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main id="main" className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center md:px-8 md:pt-52">
        <h1 className="font-display text-4xl leading-[1.08] md:text-6xl">{t("notFound.title")}</h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-stone">{t("notFound.text")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            to={path("home")}
            className="inline-block bg-gold px-8 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t("notFound.home")}
          </Link>
          <Link
            to={path("properties")}
            className="inline-block border-b border-gold pb-1 text-sm tracking-wide text-gold-deep transition-colors hover:text-ink"
          >
            {t("notFound.properties")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
