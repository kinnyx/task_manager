"use client";
import { useEffect, useState } from "react";

type Task = { id: number | string; title: string; completed: boolean; createdAt: string; updatedAt: string };

export default function TaskList() {
    const [items, setItems] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/tasks", { cache: "no-store" });
        const data = await res.json();
        setItems(data);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const handler = () => load();
        window.addEventListener("refresh-tasks", handler);
        return () => window.removeEventListener("refresh-tasks", handler);
    }, [])

    async function toggle(id: Task["id"], completed: boolean) {
        await fetch(`api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });
        load();
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
                    <span className={`flex-1 ${t.completed ? "line-through opacity-60" : ""}`}>{t.title}</span>
                    <button onClick={() => remove(t.id)} className="">Delete</button>
                </li>
            ))}
            {items.length === 0 && (
                <li className="p-3 text-sm opacity-70">No task yet. add first task! </li>
            )}
        </ul>
    )
}