import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { addStudentToClassroom, createClassroom, deleteClassroom, getAllClassrooms, getAllStudentsInClassroom, removeStudentFromClassroom } from '../controller/ClassroomController';

const ClassroomRouter = Router();

ClassroomRouter.post('/new', isAuthenticated, createClassroom);
ClassroomRouter.get('/', isAuthenticated, getAllClassrooms);
ClassroomRouter.post('/:classroomId/add', isAuthenticated, addStudentToClassroom);
ClassroomRouter.delete('/:classroomId/', isAuthenticated, removeStudentFromClassroom)
ClassroomRouter.get('/:classroomId/students', isAuthenticated, getAllStudentsInClassroom);
ClassroomRouter.delete('/:classroomId', isAuthenticated, deleteClassroom)

export default ClassroomRouter;