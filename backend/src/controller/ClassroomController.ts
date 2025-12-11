import { RequestHandler } from "express";
import DatabaseClient from "../db/client";

const prisma = DatabaseClient.getInstance().prisma;

export const createClassroom: RequestHandler = async (req, res) => {
    // CHECK IF USER HAS PERMISSIONS TO CREATE CLASSROOM

    const name = req.body.name;
    const description = req.body.description
    
    await prisma.classroom.create({
        data: {
            name,
            description,
        }
    })

    res.status(200).json({ message: "Classroom created successfully" });
}

export const getAllClassrooms: RequestHandler = async (req, res) => {
    res.status(200).json(await prisma.classroom.findMany());
}

export const addStudentToClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    const userId = req.body.userId;

    await prisma.classroomUser.create({
        data: {
            classroomId,
            userId,
        }
    })

    res.send("User " + userId + " added to classroom " + classroomId);
}

export const removeStudentFromClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    const userId = req.body.userId;

    await prisma.classroomUser.delete({
        where: {
            classroomId_userId: {
                classroomId,
                userId,
            }
        }
    })

    res.send("User " + userId + " removed from classroom " + classroomId);
}

export const getAllStudentsInClassroom: RequestHandler = async (req, res) => {
    const classroomId = req.params.classroomId;

    const students = await prisma.classroomUser.findMany({
        where: {
            classroomId: Number(classroomId),
        },
        include: {
            user: true,
        }
    });
    
    res.status(200).json(students);
}

export const deleteClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    
    await prisma.classroom.delete({
        where: {
            id: classroomId,
        }
    });

    res.status(200).json({ message: "Classroom deleted successfully" });
}   