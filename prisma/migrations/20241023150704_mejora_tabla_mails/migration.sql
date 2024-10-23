/*
  Warnings:

  - Added the required column `asunto` to the `Mails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE mails_id_seq;
ALTER TABLE "Mails" ADD COLUMN     "asunto" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('mails_id_seq'),
ALTER COLUMN "fechaEnvio" SET DEFAULT CURRENT_TIMESTAMP;
ALTER SEQUENCE mails_id_seq OWNED BY "Mails"."id";
