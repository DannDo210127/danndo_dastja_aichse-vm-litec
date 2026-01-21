import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";

const prisma = DatabaseClient.getInstance().prisma;

/**
 * Create a new classroom.
 * 
 * Route: POST /classroom/
 */
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

/**
 * Add a student to a classroom.
 * 
 * Route: POST /classroom/:classroomId/student
 */
export const addStudentToClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    const userId = req.body.userId;

    try {
        await prisma.classroomUser.create({
            data: {
                classroomId,
                userId,
            }
        })
    } catch {
        return res.status(400).json(errorMessage(11, 'User is already in the classroom'));
        
    }

    res.send("User " + userId + " added to classroom " + classroomId);
}

/**
 * Remove a student from a classroom.
 * 
 * Route: DELETE /classroom/:classroomId/student/:userId
 */
export const removeStudentFromClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    const userId = Number(req.params.userId);

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

/**
 * Get all students in a classroom.
 * 
 * Route: GET /classroom/:classroomId/students
 */
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

/**
 * Delete a classroom by its ID.
 * 
 * Route: DELETE /classroom/:classroomId
 */
export const deleteClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    
    await prisma.classroom.delete({
        where: {
            id: classroomId,
        }
    });

    res.status(200).json({ message: "Classroom deleted successfully" });
}   