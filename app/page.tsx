import { prisma } from "@/lib/prisma";
import HomeClientUI from "./HomeClientUI";

export default async function Page() {
  const [news, matches, transfers] = await Promise.all([
    prisma.news.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.match.findMany({ orderBy: { createdAt: "asc" }, take: 5 }),
    prisma.transfer.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  return <HomeClientUI news={news} matches={matches} transfers={transfers} />;
}
