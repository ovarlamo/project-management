import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

router.use(requireAdmin);
router.get('/', userController.listUsers);
router.post('/', userController.createUser);
router.put('/:id', validateObjectId('id'), userController.updateUser);
router.patch('/:id/password', validateObjectId('id'), userController.updatePassword);
router.delete('/:id', validateObjectId('id'), userController.deleteUser);

export default router;
