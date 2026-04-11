import mongoose from 'mongoose';
import { DEFAULT_PROJECT_STATUS, PROJECT_STATUSES } from '../constants/projectStatus.js';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: Object.values(PROJECT_STATUSES), default: DEFAULT_PROJECT_STATUS },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
