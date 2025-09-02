import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/data/tasks";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();
    const updated = await updateTask(params.id, {
        title: typeof body.title === "string" ? body.title : undefined,
        completed: typeof body.completed === "boolean" ? body.completed : undefined,
    });
    return NextResponse.json(updated);
}

export async function  DELETE(_req: Request, { params }: { params: { id: string } }) {
    await deleteTask(params.id);
    return NextResponse.json({ ok: true });
}