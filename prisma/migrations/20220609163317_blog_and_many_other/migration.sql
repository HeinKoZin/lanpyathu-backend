/*
  Warnings:

  - You are about to drop the `CategoryTayartaw` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryTayartaw" DROP CONSTRAINT "CategoryTayartaw_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryTayartaw" DROP CONSTRAINT "CategoryTayartaw_tayartawId_fkey";

-- DropTable
DROP TABLE "CategoryTayartaw";

-- CreateTable
CREATE TABLE "Blog" (
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

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToTayartaw" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTayartaw_AB_unique" ON "_CategoryToTayartaw"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTayartaw_B_index" ON "_CategoryToTayartaw"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToTayartaw" ADD CONSTRAINT "_CategoryToTayartaw_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTayartaw" ADD CONSTRAINT "_CategoryToTayartaw_B_fkey" FOREIGN KEY ("B") REFERENCES "tayartaws"("id") ON DELETE CASCADE ON UPDATE CASCADE;
