export type Provider = "postgres" | "mongodb";

function resoleProvider(): Provider {
    const val = process.env.DB_PROVIDER ?? "postgres";
    console.warn(`Invalid DB_PROVIDER="${val}", fallback to "postgres"`);
    return "postgres";
}

export const DB_PROVIDER = resoleProvider();