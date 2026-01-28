-- CreateTable
CREATE TABLE "VirtualMachine" (
    "id" SERIAL NOT NULL,
    "hostname" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,

    CONSTRAINT "VirtualMachine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualMachine_hostname_key" ON "VirtualMachine"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualMachine_classroomId_userId_key" ON "VirtualMachine"("classroomId", "userId");

-- AddForeignKey
ALTER TABLE "VirtualMachine" ADD CONSTRAINT "VirtualMachine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMachine" ADD CONSTRAINT "VirtualMachine_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
