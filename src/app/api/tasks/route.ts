import { NextResponse } from "next/server";
import { listTasks, createTask } from "@/lib/data/tasks";
import { validateCreateTask } from "@/lib/validate";

// ช่วยเช็คว่าเป็น object จริงๆ (ไม่ใช่ null/array)
function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function GET() {
    const items = await listTasks();
    return NextResponse.json(items);
}

export async function  POST(req: Request) {
    const parsed = validateCreateTask(await req.json().catch(() => null));
    if (!parsed.ok) return NextResponse.json({ errors: parsed.errors }, { status: 400 });

    const created = await createTask(parsed.data.title);
    return NextResponse.json(created, { status: 201 });
}