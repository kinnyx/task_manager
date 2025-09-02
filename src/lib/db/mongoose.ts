import mongoose from "mongoose";

let promise: Promise<typeof mongoose> | null = null;

export async function connectMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");
    
    if (mongoose.connection.readyState >= 1) return;
    if (!promise) promise = mongoose.connect(uri);
    await promise;
}