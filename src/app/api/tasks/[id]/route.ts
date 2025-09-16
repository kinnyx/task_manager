import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/data/tasks";

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: RouteContext) {
    const { id } = await ctx.params;

    const bodyUnknow = await req.json().catch(() => ({}));
    if (!isPlainObject(bodyUnknow)) {
        return NextResponse.json({ error: ["invalid JSON body"] }, { status: 400 });
    }

    const payload: { title?: string; completed?: boolean } = {};
    const errors: string[] = [];

    if ("title" in bodyUnknow) {
        if (typeof bodyUnknow.title !== "string") {
            errors.push("title must be a string");
        } else {
            const t = bodyUnknow.title.trim();
            if (!t) errors.push("title is required when provided");
            if (t.length > 255) errors.push("title must be <= 255 characters");
            if (!errors.length) payload.title = t;
        }
    }

    if ("completed" in bodyUnknow) {
        if (typeof bodyUnknow.completed !== "boolean") {
            errors.push("completed must be a boolean");
        } else {
            payload.completed = bodyUnknow.completed;
        }
    }

    if (!("title" in bodyUnknow) && !("completed" in bodyUnknow)) {
        errors.push("no updatable fields provided");
    }

    if (errors.length) {
        return NextResponse.json({ errors }, { status: 400 });
    }

    const updated = await updateTask(id, payload);
    return NextResponse.json(updated);
}

export async function  DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await deleteTask(id);
    return NextResponse.json({ ok: true });
}