import express from 'express';
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('teacher', 'admin'));

router.get('/', getGroups);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;

