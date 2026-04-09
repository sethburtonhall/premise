import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { SessionClaims } from "@/types/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { userId, has, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isPro =
    has({ plan: "pro" }) ||
    (sessionClaims as SessionClaims)?.metadata?.special_access === true;
  if (!isPro) {
    return NextResponse.json(
      { error: "Pro plan required to delete scopes" },
      { status: 403 },
    );
  }

  try {
    await prisma.scope.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete scope" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
