/*
  Warnings:

  - A unique constraint covering the columns `[userProfileId,question]` on the table `SurveyAnswer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProfileBooleanQuestion" AS ENUM ('OPEN_TO_OPPORTUNITIES', 'INTERESTED_IN_HIRING', 'SEEKING_CO_FOUNDERS', 'INTERESTED_IN_DEMOING', 'SEEKING_CUSTOMERS');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "career" TEXT;

-- CreateTable
CREATE TABLE "ProfileBooleanAnswer" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "question" "ProfileBooleanQuestion" NOT NULL,
    "answer" BOOLEAN NOT NULL,

    CONSTRAINT "ProfileBooleanAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileBooleanAnswer_userProfileId_question_key" ON "ProfileBooleanAnswer"("userProfileId", "question");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyAnswer_userProfileId_question_key" ON "SurveyAnswer"("userProfileId", "question");

-- AddForeignKey
ALTER TABLE "ProfileBooleanAnswer" ADD CONSTRAINT "ProfileBooleanAnswer_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
