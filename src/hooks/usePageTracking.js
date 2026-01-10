import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-5SK8QSKY1H";

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname,
    });
  }, [location]);
}
