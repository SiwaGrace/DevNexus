import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // Allow storing the cached connection on the Node.js global object.
  // This helps prevent creating multiple connections during hot reload in development.
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  // Reuse an existing connection if one is already established.
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    // Store the pending connection promise so concurrent requests share one connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so a later retry can create a new connection attempt.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
