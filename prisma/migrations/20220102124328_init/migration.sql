/*
  Warnings:

  - Added the required column `client_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `client_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `client_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `purchases` ADD COLUMN `client_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `client_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
