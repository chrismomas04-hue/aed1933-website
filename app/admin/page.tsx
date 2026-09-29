import { prisma } from "@/lib/prisma";
import AdminClientUI from "./AdminClientUI";

export default async function AdminPage() {
  const [news, players, coaches, matches, transfers, memberships] = await Promise.all([
    prisma.news.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.player.findMany({ orderBy: { no: "asc" } }),
    prisma.coach.findMany({ orderBy: { id: "asc" } }),
    prisma.match.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.transfer.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.membershipRequest.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <AdminClientUI
      news={news}
      players={players}
      coaches={coaches}
      matches={matches}
      transfers={transfers}
      memberships={memberships}
    />
  );
}
