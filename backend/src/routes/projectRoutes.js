import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.get('/', projectController.listProjects);
router.post('/', projectController.createProject);
router.put('/:id', validateObjectId('id'), projectController.updateProject);
router.delete('/:id', validateObjectId('id'), projectController.deleteProject);

export default router;
