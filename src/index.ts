import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./database.sqlite",
  driver: sqlite3.Database,
});

const app = express();
const PORT = 8000;

async function createTable() {
  const db = await dbPromise;
  await db.exec(`
        CREATE TABLE IF NOT EXISTS languages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )
      `);

  await db.exec(`
        INSERT INTO languages (name) VALUES ('JavaScript');
        INSERT INTO languages (name) VALUES ('Python');
        INSERT INTO languages (name) VALUES ('Java');
        INSERT INTO languages (name) VALUES ('C++');
        INSERT INTO languages (name) VALUES ('Ruby');
      `);
}

app.get("/languages", async (req: Request, res: Response) => {
  try {
    await createTable().catch((error) => {
      console.error("Error creating table:", error);
      process.exit(1);
    });

    const db = await dbPromise;

    const rows = await db.all("SELECT * FROM languages");
    const languages = rows.map((row: any) => row.name);

    res.json(languages);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
