import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { addStudentToClassroom, createClassroom, deleteClassroom, getAllClassrooms, getAllStudentsInClassroom, removeStudentFromClassroom } from '../controller/ClassroomController';

const ClassroomRouter = Router();

ClassroomRouter.post('/new', isAuthenticated, createClassroom);
ClassroomRouter.get('/', isAuthenticated, getAllClassrooms);
ClassroomRouter.post('/:classroomId/add', isAuthenticated, addStudentToClassroom);
ClassroomRouter.get('/:classroomId/students', isAuthenticated, getAllStudentsInClassroom);
ClassroomRouter.delete('/delete/:classroomId', isAuthenticated, deleteClassroom);
ClassroomRouter.delete('/:classroomId/:studentId', isAuthenticated, removeStudentFromClassroom);

export default ClassroomRouter;