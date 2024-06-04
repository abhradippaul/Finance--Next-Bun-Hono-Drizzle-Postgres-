import { db } from "@/db/index";
import { Hono } from "hono";
const app = new Hono();

app.get("/", async (c) => {
  try {
    const accounts = await db.query.accounts.findMany({
      where: (accounts, { eq }) => eq(accounts.id, "1"),
      columns: {
        id: true,
        name: true,
      },
    });
    return c.json({
      accounts,
    });
  } catch (err) {
    console.log(err);
    return c.json({
      error: err,
      message: "Something went wrong",
    });
  }
});

export default app;
