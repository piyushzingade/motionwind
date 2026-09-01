"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, LazyMotion, domMax, m } from "motion/react";
import { usePortalTarget } from "../../lib/use-portal-target";
import { FeedbackForm } from "../feedback-form";

export function FeedbackDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const portalTarget = usePortalTarget();
  if (!portalTarget) return null;

  return createPortal(
    <LazyMotion features={domMax}>
      <AnimatePresence>
        {open && (
          <>
            <m.div
              role="button"
              tabIndex={0}
              aria-label="Close feedback dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[6px]"
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClose();
                }
              }}
            />
            <FeedbackForm open={open} onClose={onClose} />
          </>
        )}
      </AnimatePresence>
    </LazyMotion>,
    portalTarget,
  );
}
