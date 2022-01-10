/*
  Warnings:

  - You are about to drop the column `name` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `product_photo` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `comments` DROP COLUMN `name`,
    DROP COLUMN `price`,
    DROP COLUMN `product_photo`;
