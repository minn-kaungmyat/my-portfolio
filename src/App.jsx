import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import Home from "./pages/Home";
import NoiseOverlay from "./components/ui/NoiseOverlay";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { setLenis } from "./utils/lenis";

function App() {
  useEffect(() => {
    // Smooth scrolling is motion too; keep native scrolling for these users
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      autoRaf: true,
    });

    setLenis(lenis);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <AnalyticsTracker />
        <NoiseOverlay />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </MotionConfig>
  );
}

export default App;
