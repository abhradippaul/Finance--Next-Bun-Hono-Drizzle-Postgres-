import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Author page",
  });
});

export default app;
