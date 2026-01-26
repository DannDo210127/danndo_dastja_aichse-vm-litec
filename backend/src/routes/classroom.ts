import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication';
import { addStudentToClassroom, createClassroom, deleteClassroom, getAllClassrooms, getAllStudentsInClassroom, removeStudentFromClassroom } from '../controller/ClassroomController';
import { hasPermission } from '../middleware/role';

const ClassroomRouter = Router();

ClassroomRouter.post('/new', isAuthenticated, hasPermission(['CREATE_CLASSROOM']), createClassroom);
ClassroomRouter.get('/', isAuthenticated, hasPermission(['VIEW_CLASSROOM']), getAllClassrooms);
ClassroomRouter.post('/:classroomId/add', isAuthenticated, hasPermission(['ADD_STUDENT_TO_CLASSROOM']), addStudentToClassroom);
ClassroomRouter.get('/:classroomId/students', isAuthenticated, hasPermission(['VIEW_CLASSROOM']), getAllStudentsInClassroom);
ClassroomRouter.delete('/delete/:classroomId', isAuthenticated, hasPermission(['DELETE_CLASSROOM']), deleteClassroom);
ClassroomRouter.delete('/:classroomId/:userId', isAuthenticated, hasPermission(['REMOVE_STUDENT_FROM_CLASSROOM']), removeStudentFromClassroom);

export default ClassroomRouter;