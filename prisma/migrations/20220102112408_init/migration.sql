/*
  Warnings:

  - You are about to drop the column `profile_photo` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `profile_photo`,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `profilePhoto` VARCHAR(191) NOT NULL DEFAULT 'https://weddo-ecommerce.s3.eu-west-3.amazonaws.com/profilePhotos/1626447073678.jpg';
