import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleClientUI from "./ArticleClientUI";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [article, related] = await Promise.all([
    prisma.news.findUnique({ where: { id } }),
    prisma.news.findMany({
      where: { id: { not: id } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  if (!article) notFound();

  return <ArticleClientUI article={article} related={related} />;
}
