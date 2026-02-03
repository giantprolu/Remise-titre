-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "question1" TEXT NOT NULL,
    "question2" TEXT NOT NULL,
    "question3" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);
