import { Router } from 'express';
import { createCategory, deleteCategory, getCategoriesTree, updateCategory } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, getCategoriesTree);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
