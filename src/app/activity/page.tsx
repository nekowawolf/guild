import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guildMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = guildMetadata("Activity", "Latest Guild additions from community contributors.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}