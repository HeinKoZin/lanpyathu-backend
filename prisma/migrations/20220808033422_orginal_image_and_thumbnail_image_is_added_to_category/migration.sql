/*
  Warnings:

  - You are about to drop the column `image` on the `categories` table. All the data in the column will be lost.
  - Added the required column `originalImage` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailImage` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "image",
ADD COLUMN     "originalImage" TEXT NOT NULL,
ADD COLUMN     "thumbnailImage" TEXT NOT NULL;
