"use client";
import { useEffect, useState } from "react";

type Task = { id: number | string; title: string; completed: boolean; createdAt: string; updatedAt: string };

export default function TaskList() {
    const [items, setItems] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<Task["id"] | null>(null);
    const [draft, setDraft] = useState("");

    async function load() {
        setLoading(true);
        const res = await fetch("/api/tasks", { cache: "no-store" });
        const data = await res.json();
        setItems(data);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const handler = () => { void load(); };
        window.addEventListener("refresh-tasks", handler);
        return () => window.removeEventListener("refresh-tasks", handler);
    }, [])

    async function toggle(id: Task["id"], completed: boolean) {
        // optimistic
        setItems(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
        await fetch(`api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });
        void load();
    }

    function startEdit(t: Task) {
        setEditingId(t.id);
        setDraft(t.title);
    }

    function cancelEdit() { setEditingId(null); setDraft(""); }

    async function commitEdit(id: Task["id"]) {
        const title = draft.trim();
        if (!title) return cancelEdit();
        // optimistic
        setItems(prev => prev.map(t => t.id === id ? { ...t, title } : t));
        setEditingId(null);
        await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        void load();
    }

    async function remove(id: Task["id"]) {
        await fetch(`/api/tasks/${id}`, {
            method: "DELETE"
        });
        load();
    }

    if (loading) return <p className="text-sm opacity-70">Loading...</p>
    
    return (
        <ul className="divide-y rounded-2xl border">
            {items.map((t) => (
                <li key={t.id} className="flex items-center gap-3 p-3">
                    <input 
                        type="checkbox"
                        checked={t.completed}
                        onChange={(e) => toggle(t.id, e.target.checked)}
                        className="size-5"
                    />
                    {editingId === t.id ? (
                        <input
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => commitEdit(t.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") void commitEdit(t.id);
                                if (e.key === "Escape") cancelEdit();
                            }}
                            className="flex-1 rounded border px-2 py-1"
                        />
                    ) : (
                        <button onClick={() => startEdit(t)} className={`flex-1 text-left ${t.completed ? "line-through opacity-60" : ""}`}>
                            {t.title}
                        </button>
                    )}
                    <button onClick={() => remove(t.id)} className="text-red-600 hover:underline">Delete</button>
                    {/* <span className={`flex-1 ${t.completed ? "line-through opacity-60" : ""}`}>{t.title}</span> */}
                </li>
            ))}
            {items.length === 0 && (
                <li className="p-3 text-sm opacity-70">No task yet. add first task! </li>
            )}
        </ul>
    )
}