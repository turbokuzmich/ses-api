/*
  Warnings:

  - You are about to drop the column `processed` on the `Music` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Music` DROP COLUMN `processed`,
    ADD COLUMN `status` ENUM('INITIAL', 'UPLOADED', 'PROCESSING', 'PROCESSED', 'ERROR') NOT NULL DEFAULT 'INITIAL';
