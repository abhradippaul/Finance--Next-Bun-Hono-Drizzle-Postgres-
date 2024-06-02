import { Hono } from "hono";
import { handle } from "hono/vercel";
import author from "./author";

export const runtime = "edge";

const app = new Hono().basePath("/api/v1");

app.route("/author", author);

export const GET = handle(app);
export const POST = handle(app);
