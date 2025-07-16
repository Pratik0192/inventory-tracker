-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VENDOR', 'PROCESS_COORDINATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'NOT_ACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "address" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "role" "UserRole" NOT NULL DEFAULT 'VENDOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPagePermission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "page" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPagePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOfWork" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TypeOfWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortForm" TEXT NOT NULL,
    "targetDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "Quant" TEXT NOT NULL,
    "uniqueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "unitname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "noOfPieces" INTEGER NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" SERIAL NOT NULL,
    "designNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignSize" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "designId" INTEGER NOT NULL,

    CONSTRAINT "DesignSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentInDesign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "totalTargetDays" INTEGER NOT NULL,
    "designId" INTEGER NOT NULL,

    CONSTRAINT "ComponentInDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessInComponent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "targetDays" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,

    CONSTRAINT "ProcessInComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConcernedProcesses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConcernedProcesses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNo_key" ON "User"("phoneNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueId_key" ON "User"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPagePermission_userId_page_key" ON "UserPagePermission"("userId", "page");

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Component_uniqueId_key" ON "Component"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Design_designNo_key" ON "Design"("designNo");

-- CreateIndex
CREATE INDEX "_ConcernedProcesses_B_index" ON "_ConcernedProcesses"("B");

-- AddForeignKey
ALTER TABLE "UserPagePermission" ADD CONSTRAINT "UserPagePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeOfWork" ADD CONSTRAINT "TypeOfWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignSize" ADD CONSTRAINT "DesignSize_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentInDesign" ADD CONSTRAINT "ComponentInDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessInComponent" ADD CONSTRAINT "ProcessInComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "ComponentInDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcernedProcesses" ADD CONSTRAINT "_ConcernedProcesses_A_fkey" FOREIGN KEY ("A") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcernedProcesses" ADD CONSTRAINT "_ConcernedProcesses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
