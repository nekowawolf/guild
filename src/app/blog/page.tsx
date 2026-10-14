import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guildMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";
import { fetchBlogPosts } from "@/services/blogService";

export const metadata = guildMetadata("Blog", "Articles, reviews, and deep dives covering online communities.");

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await fetchBlogPosts();
  return (
    <>
      <Header />
      <DetailClient posts={posts} />
      <Footer />
    </>
  );
}