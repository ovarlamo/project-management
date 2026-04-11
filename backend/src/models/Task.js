import mongoose from 'mongoose';
import { DEFAULT_TASK_STATUS, TASK_STATUSES } from '../constants/taskStatus.js';

const commentSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    type: { type: String, enum: ['FEATURE', 'TASK'], default: 'TASK' },
    status: {
      type: String,
      enum: Object.values(TASK_STATUSES),
      default: DEFAULT_TASK_STATUS
    },
    startDate: Date,
    dueDate: Date,
    estimatedHours: Number,
    actualHours: Number,
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    description: { type: String, required: true },
    comments: { type: [commentSchema], default: [] },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
