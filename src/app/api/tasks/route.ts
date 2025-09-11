import { NextResponse } from "next/server";
import { listTasks, createTask } from "@/lib/data/tasks";
import { error } from "console";

export async function GET() {
    const items = await listTasks();
    return NextResponse.json(items);
}

export async function  POST(req: Request) {
    const { title } = await req.json();
    if (!title || typeof title !== "string") {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    const created = await createTask(title.trim());
    return NextResponse.json(created, { status: 201 });
}