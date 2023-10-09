-- CreateTable
CREATE TABLE "UserEmbedding" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "embedding_building_what" vector,
    "embedding_want_to_learn" vector,
    "embedding_technologies" vector,
    "embedding_ask_problem_solve" vector,
    "embedding_give_provide_others" vector,

    CONSTRAINT "UserEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEmbedding_userProfileId_key" ON "UserEmbedding"("userProfileId");

-- AddForeignKey
ALTER TABLE "UserEmbedding" ADD CONSTRAINT "UserEmbedding_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
