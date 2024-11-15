-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "linux" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "windows" BOOLEAN NOT NULL DEFAULT true;
