-- DropForeignKey
ALTER TABLE "public"."ClassroomUser" DROP CONSTRAINT "ClassroomUser_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassroomUser" DROP CONSTRAINT "ClassroomUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "ClassroomUser" ADD CONSTRAINT "ClassroomUser_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomUser" ADD CONSTRAINT "ClassroomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
