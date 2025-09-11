import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/data/tasks";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json();

    const updated = await updateTask(id, {
        title: typeof body.title === "string" ? body.title : undefined,
        completed: typeof body.completed === "boolean" ? body.completed : undefined,
    });

    return NextResponse.json(updated);
}

export async function  DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await deleteTask(id);
    return NextResponse.json({ ok: true });
}