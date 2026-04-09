import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
