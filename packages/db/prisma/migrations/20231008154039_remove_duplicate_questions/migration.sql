/*
  Warnings:

  - The values [CURRENTLY_BUILDING,SEEKING_TO_LEARN] on the enum `SurveyQuestion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SurveyQuestion_new" AS ENUM ('BUILDING_WHAT', 'WANT_TO_LEARN', 'WANT_TO_HEAR', 'TECHNOLOGIES', 'ASK_PROBLEM_SOLVE', 'GIVE_PROVIDE_OTHERS');
ALTER TABLE "SurveyAnswer" ALTER COLUMN "question" TYPE "SurveyQuestion_new" USING ("question"::text::"SurveyQuestion_new");
ALTER TYPE "SurveyQuestion" RENAME TO "SurveyQuestion_old";
ALTER TYPE "SurveyQuestion_new" RENAME TO "SurveyQuestion";
DROP TYPE "SurveyQuestion_old";
COMMIT;
