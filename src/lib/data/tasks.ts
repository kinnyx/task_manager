import { DB_PROVIDER } from "../db/provider";

//Postgres (Prisma)
import { prisma } from "../db/prisma";

//Mongo (Mongoose)
import { connectMongo } from "../db/mongoose";
import { TaskModel } from "../db/models/Task";

export type TaskDTO = {
    id: number | string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};

function mapPg(task: any): TaskDTO {
    return {
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
    };
}

function mapMongo(doc: any): TaskDTO {
    return {
        id: String(doc._id), // Mongo ใช้ _id (ObjectId) → แปลงเป็น string
        title: doc.title,
        completed: !!doc.completed, // บังคับให้เป็น boolean
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
    };
}

export async function listTasks(): Promise<TaskDTO[]> {
    if (DB_PROVIDER === "postgres") {
        const rows = await prisma.task.findMany({ orderBy: { createdAt: "desc" } })
        return rows.map(mapPg);
    } else {
        await connectMongo();
        const rows = await TaskModel.find().sort({ createdAt: -1 }).lean();
        return rows.map(mapMongo);
    }
}

export async function createTask(title: string): Promise<TaskDTO> {
    if (DB_PROVIDER === "postgres") {
        const t = await prisma.task.create({ data: { title } });
        return mapPg(t);
    } else {
        await connectMongo();
        const t = await TaskModel.create({ title });
        return mapMongo(t.toObject());
    }
}

export async function updateTask(id: string, data: { title?: string; completed?: boolean }): Promise<TaskDTO> {
    if (DB_PROVIDER === "postgres") {
        const t = await prisma.task.update({ where: { id: Number(id) }, data });
        return mapPg(t);
    } else {
        await connectMongo();
        const t = await TaskModel.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!t) throw new Error("Task not found");
        return mapMongo(t);
    }
}

export async function deleteTask(id: string): Promise<{ ok: true }> {
    if (DB_PROVIDER === "postgres") {
        await prisma.task.delete({ where: { id: Number(id) } });
    } else {
        await connectMongo();
        await TaskModel.findByIdAndDelete(id);
    }
    return { ok: true };
}