import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./Schema";

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
