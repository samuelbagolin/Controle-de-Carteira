import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("indicators.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS indicators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    product TEXT NOT NULL,
    active_clients_prev INTEGER DEFAULT 0,
    new_contracts INTEGER DEFAULT 0,
    cancel_requests INTEGER DEFAULT 0,
    cancelled_within_month INTEGER DEFAULT 0,
    auto_cancellations INTEGER DEFAULT 0,
    inactivations INTEGER DEFAULT 0,
    mrr_total REAL DEFAULT 0,
    mrr_lost_cancel REAL DEFAULT 0,
    mrr_lost_inactivation REAL DEFAULT 0,
    UNIQUE(month, product)
  );
`);

// Seed initial products if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const initialProducts = ["Sittax", "Openix", "Bytoken", "Adveasy", "Klinai"];
  const insertProduct = db.prepare("INSERT INTO products (name) VALUES (?)");
  initialProducts.forEach(p => insertProduct.run(p));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM products ORDER BY name ASC").all();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/products", (req, res) => {
    try {
      const { name } = req.body;
      const result = db.prepare("INSERT INTO products (name) VALUES (?)").run(name);
      res.status(201).json({ id: result.lastInsertRowid, name });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/indicators", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM indicators ORDER BY month DESC, product ASC").all();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/indicators", (req, res) => {
    try {
      const {
        month, product, active_clients_prev, new_contracts, cancel_requests,
        cancelled_within_month, auto_cancellations, inactivations,
        mrr_total, mrr_lost_cancel, mrr_lost_inactivation
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO indicators (
          month, product, active_clients_prev, new_contracts, cancel_requests,
          cancelled_within_month, auto_cancellations, inactivations,
          mrr_total, mrr_lost_cancel, mrr_lost_inactivation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        month, product, active_clients_prev, new_contracts, cancel_requests,
        cancelled_within_month, auto_cancellations, inactivations,
        mrr_total, mrr_lost_cancel, mrr_lost_inactivation
      );

      res.status(201).json({ id: result.lastInsertRowid, ...req.body });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/indicators/:id", (req, res) => {
    try {
      const { id } = req.params;
      const {
        month, product, active_clients_prev, new_contracts, cancel_requests,
        cancelled_within_month, auto_cancellations, inactivations,
        mrr_total, mrr_lost_cancel, mrr_lost_inactivation
      } = req.body;

      const stmt = db.prepare(`
        UPDATE indicators SET
          month = ?, product = ?, active_clients_prev = ?, new_contracts = ?,
          cancel_requests = ?, cancelled_within_month = ?, auto_cancellations = ?,
          inactivations = ?, mrr_total = ?, mrr_lost_cancel = ?,
          mrr_lost_inactivation = ?
        WHERE id = ?
      `);

      stmt.run(
        month, product, active_clients_prev, new_contracts, cancel_requests,
        cancelled_within_month, auto_cancellations, inactivations,
        mrr_total, mrr_lost_cancel, mrr_lost_inactivation,
        id
      );

      res.json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/indicators/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM indicators WHERE id = ?").run(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
