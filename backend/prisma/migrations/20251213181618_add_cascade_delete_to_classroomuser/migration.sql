-- DropForeignKey
ALTER TABLE "public"."ClassroomUser" DROP CONSTRAINT "ClassroomUser_classroomId_fkey";

-- AddForeignKey
ALTER TABLE "ClassroomUser" ADD CONSTRAINT "ClassroomUser_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
