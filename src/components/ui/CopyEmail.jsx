import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

// mailto: opens nothing on many machines without a mail client, so offer the
// address itself with one-click copy as a reliable fallback.
const CopyEmail = ({ email }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API blocked (insecure context / permissions): select-and-copy fallback
      const input = document.createElement("textarea");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span>{email}</span>
      <span className="relative h-4 w-4">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            {copied ? (
              <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy aria-hidden="true" className="h-4 w-4" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{copied ? "Copied" : "Copy email address"}</span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
};

export default CopyEmail;
