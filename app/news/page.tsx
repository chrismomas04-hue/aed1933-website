// app/news/page.tsx
import prisma from '../../lib/prisma';
import NewsClientUI from './NewsClientUI';

export default async function NewsPage() {
  // Αυτό τρέχει κρυφά στον server και μιλάει με το Prisma με ασφάλεια!
  const newsArticles = await prisma.news.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Στέλνει τα έτοιμα άρθρα στο UI
  return <NewsClientUI newsArticles={newsArticles} />;
}