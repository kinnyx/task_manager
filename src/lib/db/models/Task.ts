import mongoose, { Schema, models } from "mongoose";

const TaskSchema = new Schema(
    {
        title: { type: String, required: true, maxlength: 255 },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const TaskModel = models.Task || mongoose.model("Task", TaskSchema);