/*
  Warnings:

  - The primary key for the `sku_option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `optionId` on the `sku_option` table. All the data in the column will be lost.
  - You are about to drop the `option` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `sku_option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `varientId` to the `sku_option` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "option" DROP CONSTRAINT "option_varientId_fkey";

-- DropForeignKey
ALTER TABLE "sku_option" DROP CONSTRAINT "sku_option_optionId_fkey";

-- AlterTable
ALTER TABLE "sku_option" DROP CONSTRAINT "sku_option_pkey",
DROP COLUMN "optionId",
ADD COLUMN     "value" TEXT NOT NULL,
ADD COLUMN     "varientId" TEXT NOT NULL,
ADD CONSTRAINT "sku_option_pkey" PRIMARY KEY ("skuId", "varientId");

-- DropTable
DROP TABLE "option";

-- AddForeignKey
ALTER TABLE "sku_option" ADD CONSTRAINT "sku_option_varientId_fkey" FOREIGN KEY ("varientId") REFERENCES "varient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
