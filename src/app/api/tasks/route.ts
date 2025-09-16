import { NextResponse } from "next/server";
import { listTasks, createTask } from "@/lib/data/tasks";

// ช่วยเช็คว่าเป็น object จริงๆ (ไม่ใช่ null/array)
function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function GET() {
    const items = await listTasks();
    return NextResponse.json(items);
}

export async function  POST(req: Request) {
    try {
        const bodyUnknow = await req.json().catch(() => null);
        if (!isPlainObject(bodyUnknow)) {
            return NextResponse.json({ error: ["invalid JSON body"] }, { status: 400 });
        }

        // ดึง title แล้วทำความสะอาด
        const title = typeof bodyUnknow.title === "string" ? bodyUnknow.title.trim() : "";

        const errors: string[] = [];
        if (!title) errors.push("title is required");
        if (title.length > 255) errors.push("title mush be <= 255 characters");

        if (errors.length) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const created = await createTask(title);
        return NextResponse.json(created, { status: 201 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "unexpected server error" }, { status: 500 })
    }
}