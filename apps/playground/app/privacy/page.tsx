import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@repo/ui/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Motionwind privacy policy.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
