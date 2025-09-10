"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="">
      <header className="">
        <h1 className="">Task Manager</h1>
        <p className="">Next.js 15 • Tailwind v4 • Postgres or Mongo</p>
      </header>
      <TaskForm onCreated={() => (window as any).dispatchEvent(new Event("refresh-task"))} />
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
