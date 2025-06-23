/*
  Warnings:

  - A unique constraint covering the columns `[unit]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_unit_key" ON "Item"("unit");
