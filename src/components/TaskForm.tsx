"use client";
import { useState } from "react";

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        setLoading(false);
        if (res.ok) {
            setTitle("");
            onCreated();
        }
    };

    return (
        <form onSubmit={submit} className="flex gap-2">
            <input  
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task..."
                className="flex-1 rounded-2xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <button disabled={loading} className="rounded-2xl bg-[var(--color-brand)] px-4 py-2 text-white disabled:opacity-50">
                {loading ? "Adding..." : "+ Add"}
            </button>
        </form>
    );
}