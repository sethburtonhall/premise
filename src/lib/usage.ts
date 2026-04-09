import { prisma } from "./prisma";

export const FREE_SCOPE_LIMIT = 2;

export async function getScopeCount(userId: string): Promise<number> {
  const count = await prisma.scope.count({
    where: {
      userId: userId,
    },
  });

  return count;
}

export async function canGenerateScope(
  userId: string,
  isPro: boolean,
): Promise<{ allowed: boolean; count: number }> {
  if (isPro) return { allowed: true, count: 0 };
  const count = await getScopeCount(userId);
  return { allowed: count < FREE_SCOPE_LIMIT, count };
}
