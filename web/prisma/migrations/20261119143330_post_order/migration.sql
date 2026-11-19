-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "homeOrder" INTEGER,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Post_order_idx" ON "Post"("order");
