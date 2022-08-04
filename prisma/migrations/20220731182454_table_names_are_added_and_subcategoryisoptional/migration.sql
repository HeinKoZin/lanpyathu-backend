/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlogCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('ADMIN', 'EDITOR', 'USER');

-- DropForeignKey
ALTER TABLE "_BlogToBlogCategory" DROP CONSTRAINT "_BlogToBlogCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToBlogCategory" DROP CONSTRAINT "_BlogToBlogCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTayartaw" DROP CONSTRAINT "_CategoryToTayartaw_A_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "user_roles" NOT NULL DEFAULT E'USER';

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "BlogCategory";

-- DropTable
DROP TABLE "Category";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "markdown" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rendered_markdown" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- AddForeignKey
ALTER TABLE "_CategoryToTayartaw" ADD CONSTRAINT "_CategoryToTayartaw_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogCategory" ADD CONSTRAINT "_BlogToBlogCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogCategory" ADD CONSTRAINT "_BlogToBlogCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
