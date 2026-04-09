import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.get('/', taskController.listTasks);
router.post('/', taskController.createTask);
router.put('/:id', validateObjectId('id'), taskController.updateTask);
router.post('/:id/comments', validateObjectId('id'), taskController.addComment);
router.delete('/:id', validateObjectId('id'), taskController.deleteTask);

export default router;
