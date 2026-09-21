import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Lightbox from "../components/Lightbox";
import PropertyDetailView from "../components/PropertyDetailView";
import { getProperty } from "../api/client";
import { PLACEHOLDER_IMAGE } from "../utils/format";
import { useLang, localizedProperty } from "../i18n";

export default function PropertyDetail() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const [raw, setProperty] = useState(null);
  const property = raw ? localizedProperty(raw, lang) : null;
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setProperty(null);
    setError(false);
    getProperty(id)
      .then(setProperty)
      .catch(() => setError(true));
  }, [id, retryCount]);

  if (error) {
    return (
      <div className="bg-paper min-h-screen">
        <Header />
        <div className="pt-40 pb-20 text-center">
          <p className="text-stone text-sm">
            {t("detail.loadError")}
          </p>
          <button
            type="button"
            onClick={() => setRetryCount((c) => c + 1)}
            className="mt-4 border border-gold text-gold px-6 py-2 text-sm tracking-wide hover:bg-gold hover:text-ink transition-colors"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-paper min-h-screen">
        <Header />
        <div className="pt-40 text-center text-stone text-sm">{t("common.loading")}</div>
      </div>
    );
  }

  const images = property.images.length ? property.images : [{ url: PLACEHOLDER_IMAGE }];

  return (
    <div className="bg-paper">
      <Header />

      <PropertyDetailView property={property} onOpenImage={setLightboxIndex} />

      <Footer />

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
