-- CreateTable
CREATE TABLE "AbrintLeads" (
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "selectedAnalytics" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbrintLeads_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "AbrintLeads_email_key" ON "AbrintLeads"("email");
