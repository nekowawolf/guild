import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuildContent from "./GuildContent";
import { guildMetadata } from "@/constants/metadataTemplates";

export const metadata = guildMetadata("Guild", "Guild Directory");

export default function GuildPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <GuildContent />
      </main>
      <Footer />
    </>
  );
}