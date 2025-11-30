import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category';

const buildTree = (flat: any[]) => {
  const map = new Map();
  const roots: any[] = [];

  flat.forEach(c => map.set(c._id.toString(), { ...c, children: [] }));

  flat.forEach(c => {
    if (c.parent) {
      const parent = map.get(c.parent.toString());
      parent?.children.push(map.get(c._id.toString()));
    } else {
      roots.push(map.get(c._id.toString()));
    }
  });

  return roots;
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, parent } = req.body;

  const cat = new Category({ name, parent: parent || null });
  await cat.save();

  res.status(201).json(cat);
};

export const getCategoriesTree = async (req: Request, res: Response) => {
  const all = await Category.find().lean();
  const tree = buildTree(all);
  res.json(tree);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { name, status, parent } = req.body;

  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: 'Not found' });

  if (name) cat.name = name;
  if (parent !== undefined) cat.parent = parent;

  if (status === 'inactive') {
    cat.status = 'inactive';

    const descendants = await getDescendants(cat._id);
    await Category.updateMany({ _id: { $in: descendants } }, { $set: { status: 'inactive' } });
  }

  await cat.save();
  res.json(cat);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: 'Not found' });

  await Category.updateMany({ parent: cat._id }, { $set: { parent: cat.parent || null } });

  await Category.deleteOne({ _id: cat._id });

  res.json({ message: 'Deleted & children reassigned' });
};

const getDescendants = async (rootId: mongoose.Types.ObjectId) => {
  const stack = [rootId];
  const result: any[] = [];

  while (stack.length) {
    const parentId = stack.pop()!;
    const children = await Category.find({ parent: parentId }).lean();

    children.forEach(child => {
      result.push(child._id);
      stack.push(child._id);
    });
  }

  return result;
};
