-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Language" (
    "code" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "dir" VARCHAR(3) NOT NULL DEFAULT 'ltr',

    CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "ContentEntry" (
    "langCode" VARCHAR(32) NOT NULL,
    "key" VARCHAR(512) NOT NULL,
    "value" TEXT NOT NULL,
    "type" VARCHAR(16) NOT NULL DEFAULT 'text',

    CONSTRAINT "ContentEntry_pkey" PRIMARY KEY ("langCode","key")
);

-- CreateIndex
CREATE INDEX "ContentEntry_langCode_idx" ON "ContentEntry"("langCode");
