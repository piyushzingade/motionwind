import type { Metadata } from "next";
import { TermsOfServicePage } from "@repo/ui/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Motionwind terms of service.",
};

export default function TermsPage() {
  return <TermsOfServicePage />;
}
