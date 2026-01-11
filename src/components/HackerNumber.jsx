import { useEffect, useState } from "react";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const HackerNumber = ({ value, delay = 0, baseDuration = 1400 }) => {
  const number = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  const duration = baseDuration + number.toString().length * 700;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = null;
    let raf;

    const startTime = performance.now() + delay;

    const animate = (timestamp) => {
      if (timestamp < startTime) {
        raf = requestAnimationFrame(animate);
        return;
      }

      if (!start) start = timestamp;
      const rawProgress = Math.min((timestamp - start) / duration, 1);
      const eased = easeOutCubic(rawProgress);

      setDisplay(Math.floor(eased * number));

      if (rawProgress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [number, duration, delay]);

  return (
    <span className="font-semibold tabular-nums text-white">
      {display}
      {suffix}
    </span>
  );
};

export default HackerNumber;
