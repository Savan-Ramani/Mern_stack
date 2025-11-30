import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parent?: mongoose.Types.ObjectId | null;
  status: 'active' | 'inactive';
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
