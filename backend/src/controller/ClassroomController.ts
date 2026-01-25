import { RequestHandler } from "express";
import DatabaseClient from "../db/client";
import { errorMessage } from "../util/Error";
import { successMessage } from "../util/Success";

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

    res.status(200).json(successMessage(53, 'Classroom created successfully'));
}

export const getAllClassrooms: RequestHandler = async (req, res) => {
    const user = req.user;

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

    res.status(200).send(successMessage(54, 'User added to classroom successfully'));
}

/**
 * Remove a student from a classroom.
 * 
 * Route: DELETE /classroom/:classroomId/student/:userId
 */
export const removeStudentFromClassroom: RequestHandler = async (req, res) => {
    const classroomId = Number(req.params.classroomId);
    const userId = Number(req.params.userId);

    try {
        await prisma.classroomUser.delete({
            where: {
                classroomId_userId: {
                    classroomId,
                    userId,
                }
            }
        })
        
    } catch {
        return res.status(400).json(errorMessage(16, 'User is not in classroom anymore'));
        
    }

    res.status(200).send(successMessage(56, 'Removed Student: ' + userId + ' from classroom'));
}

/**
 * Get all students in a classroom.
 * 
 * Route: GET /classroom/:classroomId/students
 */
export const getAllStudentsInClassroom: RequestHandler = async (req, res) => {
    const classroomId = req.params.classroomId;

    if(isNaN(Number(classroomId))) {
        return res.status(400).json(errorMessage(3, 'Classroom ID is not valid'));
    }

    try {
        const students = await prisma.classroomUser.findMany({
            where: {
                classroomId: Number(classroomId),
            },
            include: {
                user: true,
            }
        });
        
        return res.status(200).json(students);
    } catch {
        return res.status(400).json(errorMessage(12, 'Could not retrieve students'));
    }
    
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

    res.status(200).json(successMessage(55, 'Classroom deleted successfully'));
}   