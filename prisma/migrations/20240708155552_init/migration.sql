-- CreateTable
CREATE TABLE "SKU" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "stock" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "SKU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_option" (
    "skuId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "sku_option_pkey" PRIMARY KEY ("skuId","optionId")
);

-- AddForeignKey
ALTER TABLE "SKU" ADD CONSTRAINT "SKU_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_option" ADD CONSTRAINT "sku_option_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "SKU"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_option" ADD CONSTRAINT "sku_option_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
