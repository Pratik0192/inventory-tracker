/*
  Warnings:

  - You are about to drop the `UserPagePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPagePermission" DROP CONSTRAINT "UserPagePermission_userId_fkey";

-- DropTable
DROP TABLE "UserPagePermission";

-- CreateTable
CREATE TABLE "PagePermission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "page" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PagePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PagePermission_userId_page_key" ON "PagePermission"("userId", "page");

-- AddForeignKey
ALTER TABLE "PagePermission" ADD CONSTRAINT "PagePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
