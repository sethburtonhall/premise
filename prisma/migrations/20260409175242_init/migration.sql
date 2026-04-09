-- CreateTable
CREATE TABLE "scopes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scopes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scopes_user_id_idx" ON "scopes"("user_id");
