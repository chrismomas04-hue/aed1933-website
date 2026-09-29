import { prisma } from "@/lib/prisma";
import TransfersClientUI from "./TransfersClientUI";

export default async function TransfersPage() {
  const transfers = await prisma.transfer.findMany({
    orderBy: { createdAt: "asc" },
  });

  return <TransfersClientUI transfers={transfers} />;
}
