-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "tittle" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentStock" (
    "id" SERIAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "currentId" INTEGER NOT NULL,

    CONSTRAINT "CurrentStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "statusStock" BOOLEAN NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentStock_currentId_key" ON "CurrentStock"("currentId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentStock" ADD CONSTRAINT "CurrentStock_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
