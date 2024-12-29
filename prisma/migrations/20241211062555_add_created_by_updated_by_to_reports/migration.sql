/*
  Warnings:

  - Added the required column `createdById` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientFileNumber` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "doctorName" TEXT,
ADD COLUMN     "patientFileNumber" TEXT NOT NULL,
ADD COLUMN     "reportCreatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reportModifiedOn" TIMESTAMP(3),
ADD COLUMN     "updatedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
