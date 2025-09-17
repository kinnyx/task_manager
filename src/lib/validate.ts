// เช็คว่าเป็น object ปกติ (ไม่ใช่ null/array)
export function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

type Ok<T> = { ok: true; data: T };
type Fail = { ok: false; errors: string[] };
const ok = <T,>(data: T): Ok<T> => ({ ok: true, data });
const fail = (...errors: string[]): Fail => ({ ok: false, errors });

export type UpdatePayload = { title?: string; completed?: boolean };

export function validateCreateTask(body: unknown): Ok<{ title: string }> | Fail {
    if (!isPlainObject(body)) return fail("invalid JSON body");
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return fail("title is required");
    if (title.length > 255) return fail("title must be <= 255 characters");
    return ok({ title })
}

export function validateUpdateTask(body: unknown): Ok<UpdatePayload> | Fail {
    if (!isPlainObject(body)) return fail("invalid JSON body");

    const payload: UpdatePayload = {};
    const errors: string[] = [];

    if ("title" in body) {
        if (typeof body.title !== "string") errors.push("title must be a string");
        else {
            const t = body.title.trim();
            if (!t) errors.push("title is required when provided");
            if (t.length > 255) errors.push("title must be <= 255 characters");
            if (errors.length === 0) payload.title = t;
        }
    }

    if ("completed" in body) {
        const b = toBooleanLoose((body as any).completed);
        if (typeof b === "undefined") errors.push("completed must be a boolean");
        else payload.completed = b;
    }

    if (!("title" in body) && !("completed" in body)) errors.push("no updatable fields provided");

    return errors.length ? fail(...errors) : ok(payload);
}

function toBooleanLoose(v: unknown): boolean | undefined {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1 ? true : v === 0 ? false : undefined;
    if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true" || s === "1") return true;
        if (s === "false" || s === "0") return false;
    }
    return undefined;
}