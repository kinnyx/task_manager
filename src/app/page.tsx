"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <p className="text-sm opacity-80">Next.js 15 • Tailwind v4 • Postgres or Mongo</p>
      </header>
      <TaskForm onCreated={() => (window as any).dispatchEvent(new Event("refresh-tasks"))} />
      {/* Simple refresh bridge */}
      <RefreshBridge />
      <TaskList />
    </main>
  );
}

function RefreshBridge() {
  // Optional: a tiny bridge if you want to broadcast events between components
  // (TaskForm triggers a window event after creation; TaskList could also listen to it.)
  return null;
}
