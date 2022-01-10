/*
  Warnings:

  - You are about to drop the column `available` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `_categoriesToproducts_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_productsToproducts_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_productsToproducts_purchased` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_products_purchasedTopurchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_purchased` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchases` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categoriesToproducts_categories` DROP FOREIGN KEY `_categoriestoproducts_categories_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_categoriesToproducts_categories` DROP FOREIGN KEY `_categoriestoproducts_categories_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_productsToproducts_categories` DROP FOREIGN KEY `_productstoproducts_categories_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_productsToproducts_categories` DROP FOREIGN KEY `_productstoproducts_categories_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_productsToproducts_purchased` DROP FOREIGN KEY `_productstoproducts_purchased_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_productsToproducts_purchased` DROP FOREIGN KEY `_productstoproducts_purchased_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_products_purchasedTopurchases` DROP FOREIGN KEY `_products_purchasedtopurchases_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_products_purchasedTopurchases` DROP FOREIGN KEY `_products_purchasedtopurchases_ibfk_2`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `products_categories` DROP FOREIGN KEY `products_categories_ibfk_2`;

-- DropForeignKey
ALTER TABLE `products_categories` DROP FOREIGN KEY `products_categories_ibfk_1`;

-- DropForeignKey
ALTER TABLE `products_purchased` DROP FOREIGN KEY `products_purchased_ibfk_1`;

-- DropForeignKey
ALTER TABLE `products_purchased` DROP FOREIGN KEY `products_purchased_ibfk_2`;

-- DropForeignKey
ALTER TABLE `purchases` DROP FOREIGN KEY `purchases_client_id_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `available`,
    DROP COLUMN `deleted`,
    DROP COLUMN `discount`,
    DROP COLUMN `link`,
    DROP COLUMN `stock`;

-- DropTable
DROP TABLE `_categoriesToproducts_categories`;

-- DropTable
DROP TABLE `_productsToproducts_categories`;

-- DropTable
DROP TABLE `_productsToproducts_purchased`;

-- DropTable
DROP TABLE `_products_purchasedTopurchases`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `products_categories`;

-- DropTable
DROP TABLE `products_purchased`;

-- DropTable
DROP TABLE `purchases`;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `product_photo` VARCHAR(191) NOT NULL DEFAULT 'https://weddo-ecommerce.s3.eu-west-3.amazonaws.com/profilePhotos/1626447073678.jpg',
    `client_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `createdBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
