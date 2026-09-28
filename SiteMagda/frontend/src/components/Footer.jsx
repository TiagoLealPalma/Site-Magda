import { Link } from "react-router-dom";
import { useLang } from "../i18n";

export default function Footer() {
  const { t, path } = useLang();
  return (
    <footer id="contacto" className="bg-charcoal text-paper scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-16 grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-x-6 gap-y-10 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl text-gold-soft">Magda Leal</p>
          <p className="mt-4 text-sm text-paper/60 leading-relaxed max-w-[26ch]">
            {t("footer.blurb")}
          </p>
        </div>

        <FooterColumn
          title={t("footer.properties")}
          links={[
            { label: t("footer.buy"), to: path("properties") + "?tipo=venda" },
            { label: t("footer.sell"), to: path("properties") },
            { label: t("footer.rent"), to: path("properties") + "?tipo=arrendar" },
          ]}
        />
        <FooterColumn
          title={t("footer.social")}
          links={[     
            { label: "Instagram", href: "https://www.instagram.com/magdalealteam/" },
            { label: "Facebook", href: "https://www.facebook.com/magdalealconsultora" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/magdaleal/?originalSubdomain=pt" },
          ]}
        />
        <FooterColumn
          title={t("footer.kw")}
          links={[{ label: t("footer.press"), href: "https://www.kwportugal.pt/pt/the-keller-williams" }]}
        />
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} Magda Leal — {t("footer.tagline")}
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-paper/50 mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} className="text-sm text-paper/80 hover:text-gold-soft transition-colors">
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-paper/80 hover:text-gold-soft transition-colors"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
