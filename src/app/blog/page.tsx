import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guildMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = guildMetadata("Blog", "Articles, reviews, deep dives, and analysis.");

export default function BlogPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}