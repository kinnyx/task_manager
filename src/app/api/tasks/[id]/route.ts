import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/data/tasks";
import { validateUpdateTask } from "@/lib/validate";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: RouteContext) {
    try {
        const { id } = await ctx.params;

        const raw = await req.text();
        console.log("RAW PUT body:", raw);

        let json: unknown = null;
        if (raw && raw.length > 0) {
            try {
                json = JSON.parse(raw);
            } catch (e) {
                return NextResponse.json(
                    { error: ["invalid JSON body", String(e)] },
                    { status: 400 },
                );
            }
        } else {
            json = {};
        }

        const parsed = validateUpdateTask(json);
        if (!parsed.ok) {
            return NextResponse.json({ errors: parsed.errors }, { status: 400 });
        }

        const updated = await updateTask(id, parsed.data);
        return NextResponse.json(updated);
    } catch (err) {
        console.error("PUT /api/tasks/[id] error:", err);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
    
}

export async function  DELETE(_req: Request, ctx: RouteContext) {
    const { id } = await ctx.params;
    await deleteTask(id);
    return NextResponse.json({ ok: true });
}