-- AlterTable
ALTER TABLE `user` ADD COLUMN `iconSrc` VARCHAR(191) NOT NULL DEFAULT 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png';

-- CreateTable
CREATE TABLE `AudioMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `audioSrc` VARCHAR(191) NOT NULL,
    `textRecognized` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `senderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AudioMessage` ADD CONSTRAINT `AudioMessage_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
