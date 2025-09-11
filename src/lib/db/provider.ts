export type Provider = "postgres" | "mongodb";

const raw = (process.env.DB_PROVIDER ?? "").trim().toLowerCase();

export const DB_PROVIDER: Provider = raw === "postgres" || raw === "mongodb" ? (raw as Provider) : "postgres";

//เตือนเฉพาะตอนค่าผิดจริงๆเท่านั้น
if (raw && raw !== "postgres" && raw !== "mongodb") {
    // ใช้ JSON.stringify เพื่อเห็นค่าจริง (รวมช่องว่าง/quote ถ้ามี)
    console.warn(`Invalid DB_PROVIDER=${JSON.stringify(raw)}, fallback to "postgres"`);
}