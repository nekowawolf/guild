import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guildMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = guildMetadata("Activity", "Web activity.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}