-- CreateTable
CREATE TABLE `AttendanceReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `status` ENUM('HADIR', 'TERLAMBAT', 'PULANG_CEPAT', 'TIDAK_HADIR') NOT NULL,
    `notes` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `attendanceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AttendanceReport_attendanceId_key`(`attendanceId`),
    INDEX `AttendanceReport_userId_date_idx`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceReport` ADD CONSTRAINT `AttendanceReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
