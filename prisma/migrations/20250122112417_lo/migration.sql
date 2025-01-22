/*
  Warnings:

  - Changed the type of `utilities` on the `lease` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `leaseType` on the `lease` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "lease" DROP COLUMN "utilities",
ADD COLUMN     "utilities" TEXT NOT NULL,
DROP COLUMN "leaseType",
ADD COLUMN     "leaseType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "LeaseType";

-- DropEnum
DROP TYPE "Utilities";
