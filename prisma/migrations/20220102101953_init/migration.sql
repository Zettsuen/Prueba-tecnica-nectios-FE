/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `profile_photo` VARCHAR(191) NOT NULL DEFAULT 'https://weddo-ecommerce.s3.eu-west-3.amazonaws.com/profilePhotos/1626447073678.jpg',
    `role` ENUM('USER', 'ADMIN') NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `discount` INTEGER NULL,
    `link` VARCHAR(191) NULL,
    `product_photo` VARCHAR(191) NOT NULL DEFAULT 'https://weddo-ecommerce.s3.eu-west-3.amazonaws.com/profilePhotos/1626447073678.jpg',
    `available` BOOLEAN NOT NULL DEFAULT true,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `stock` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `parent_category` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ref_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `purchases_ref_code_key`(`ref_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_purchased` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `purchase_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `addons_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_productsToproducts_purchased` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_productsToproducts_purchased_AB_unique`(`A`, `B`),
    INDEX `_productsToproducts_purchased_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_productsToproducts_categories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_productsToproducts_categories_AB_unique`(`A`, `B`),
    INDEX `_productsToproducts_categories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_categoriesToproducts_categories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_categoriesToproducts_categories_AB_unique`(`A`, `B`),
    INDEX `_categoriesToproducts_categories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_products_purchasedTopurchases` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_products_purchasedTopurchases_AB_unique`(`A`, `B`),
    INDEX `_products_purchasedTopurchases_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_purchased` ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products_purchased` ADD FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products_categories` ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products_categories` ADD FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_productsToproducts_purchased` ADD FOREIGN KEY (`A`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_productsToproducts_purchased` ADD FOREIGN KEY (`B`) REFERENCES `products_purchased`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_productsToproducts_categories` ADD FOREIGN KEY (`A`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_productsToproducts_categories` ADD FOREIGN KEY (`B`) REFERENCES `products_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoriesToproducts_categories` ADD FOREIGN KEY (`A`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoriesToproducts_categories` ADD FOREIGN KEY (`B`) REFERENCES `products_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_products_purchasedTopurchases` ADD FOREIGN KEY (`A`) REFERENCES `products_purchased`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_products_purchasedTopurchases` ADD FOREIGN KEY (`B`) REFERENCES `purchases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
