-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SurveyQuestion" ADD VALUE 'CURRENTLY_BUILDING';
ALTER TYPE "SurveyQuestion" ADD VALUE 'SEEKING_TO_LEARN';
ALTER TYPE "SurveyQuestion" ADD VALUE 'TECHNOLOGIES';
ALTER TYPE "SurveyQuestion" ADD VALUE 'ASK_PROBLEM_SOLVE';
ALTER TYPE "SurveyQuestion" ADD VALUE 'GIVE_PROVIDE_OTHERS';
