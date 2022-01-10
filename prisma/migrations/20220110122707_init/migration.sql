/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` ADD COLUMN `key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `comments_key_key` ON `comments`(`key`);

-- CreateIndex
CREATE UNIQUE INDEX `products_key_key` ON `products`(`key`);

-- CreateIndex
CREATE UNIQUE INDEX `users_key_key` ON `users`(`key`);
