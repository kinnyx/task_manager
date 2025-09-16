"use client";
import { useState } from "react";

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        const t = title.trim();
        if (!t) { setErr("กรุณาพิมพ์ชื่องาน"); return; }
        if (t.length > 255) { setErr("ชื่องานต้องยาวไม่เกิน 255 ตัวอักษร"); return; }

        setLoading(true);
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: t }),
        });
        setLoading(false);

        if (!res.ok) {
            // อ่าน error ที่ฝั่ง server ส่งมา
            const data = await res.json().catch(() => ({}));
            setErr(Array.isArray(data?.errors) ? data.errors.join(", ") : "เพิ่มงานไม่สำเร็จ");
            return;
        }

        setTitle("");
        onCreated();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-2">
            <div className="flex gap-2">
                <input  
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task..."
                    required
                    maxLength={255}
                    className="flex-1 rounded-2xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                />
                <button disabled={loading} className="rounded-2xl bg-[var(--color-brand)] px-4 py-2 text-white disabled:opacity-50">
                    {loading ? "Adding..." : "+ Add"}
                </button>
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
        </form>
    );
}