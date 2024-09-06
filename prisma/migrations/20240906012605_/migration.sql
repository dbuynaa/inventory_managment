/*
  Warnings:

  - The values [ADJUSTED] on the enum `AdjustmentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [INCREASE,DECREASE] on the enum `ChangeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `reference_id` on the `InventoryLog` table. All the data in the column will be lost.
  - You are about to drop the column `quantityOrdered` on the `PurchaseOrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_unit` on the `SalesDetail` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_sold` on the `SalesDetail` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `SalesDetail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inventoryLogId]` on the table `InventoryAdjustment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inventoryLogId` to the `InventoryAdjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `PurchaseOrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Sale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `pricePerUnit` to the `SalesDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantitySold` to the `SalesDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `SalesDetail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SalesStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED');

-- AlterEnum
BEGIN;
CREATE TYPE "AdjustmentType_new" AS ENUM ('INCREASE', 'DECREASE', 'CORRECTION', 'WRITTEN_OFF');
ALTER TABLE "InventoryAdjustment" ALTER COLUMN "adjustmentType" TYPE "AdjustmentType_new" USING ("adjustmentType"::text::"AdjustmentType_new");
ALTER TYPE "AdjustmentType" RENAME TO "AdjustmentType_old";
ALTER TYPE "AdjustmentType_new" RENAME TO "AdjustmentType";
DROP TYPE "AdjustmentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ChangeType_new" AS ENUM ('SALE', 'PURCHASE', 'ADJUSTMENT');
ALTER TABLE "InventoryLog" ALTER COLUMN "changeType" TYPE "ChangeType_new" USING ("changeType"::text::"ChangeType_new");
ALTER TYPE "ChangeType" RENAME TO "ChangeType_old";
ALTER TYPE "ChangeType_new" RENAME TO "ChangeType";
DROP TYPE "ChangeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InventoryAdjustment" ADD COLUMN     "inventoryLogId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InventoryLog" DROP COLUMN "reference_id",
ADD COLUMN     "referenceId" TEXT;

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrderDetail" DROP COLUMN "quantityOrdered",
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "created_at",
DROP COLUMN "payment_method",
DROP COLUMN "total_amount",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SalesStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SalesDetail" DROP COLUMN "price_per_unit",
DROP COLUMN "quantity_sold",
DROP COLUMN "total_price",
ADD COLUMN     "pricePerUnit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantitySold" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InventoryAdjustment_inventoryLogId_key" ON "InventoryAdjustment"("inventoryLogId");

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_inventoryLogId_fkey" FOREIGN KEY ("inventoryLogId") REFERENCES "InventoryLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
