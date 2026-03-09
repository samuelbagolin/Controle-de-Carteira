import Database from "better-sqlite3";

const db = new Database("indicators.db");

const openix_jan_26 = {
  month: "2026-01",
  product: "Openix",
  active_clients_prev: 1151, // 1237 + 49 - 47 - 21 - 87 = 1131. Let's use 1131.
  new_contracts: 52,
  cancel_requests: 58,
  cancelled_within_month: 45,
  auto_cancellations: 18,
  inactivations: 75,
  mrr_total: 735000,
  mrr_lost_cancel: 32000,
  mrr_lost_inactivation: 42000
};

const openix_feb_26 = {
  month: "2026-02",
  product: "Openix",
  active_clients_prev: 1045, // 1131 + 52 - 45 - 18 - 75 = 1045.
  new_contracts: 55,
  cancel_requests: 52,
  cancelled_within_month: 40,
  auto_cancellations: 15,
  inactivations: 68,
  mrr_total: 720000,
  mrr_lost_cancel: 30000,
  mrr_lost_inactivation: 38000
};

const insertStmt = db.prepare(`
  INSERT INTO indicators (
    month, product, active_clients_prev, new_contracts, cancel_requests, 
    cancelled_within_month, auto_cancellations, inactivations, 
    mrr_total, mrr_lost_cancel, mrr_lost_inactivation
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertStmt.run(
  openix_jan_26.month, openix_jan_26.product, openix_jan_26.active_clients_prev,
  openix_jan_26.new_contracts, openix_jan_26.cancel_requests, 
  openix_jan_26.cancelled_within_month, openix_jan_26.auto_cancellations, 
  openix_jan_26.inactivations, openix_jan_26.mrr_total, 
  openix_jan_26.mrr_lost_cancel, openix_jan_26.mrr_lost_inactivation
);

insertStmt.run(
  openix_feb_26.month, openix_feb_26.product, openix_feb_26.active_clients_prev,
  openix_feb_26.new_contracts, openix_feb_26.cancel_requests, 
  openix_feb_26.cancelled_within_month, openix_feb_26.auto_cancellations, 
  openix_feb_26.inactivations, openix_feb_26.mrr_total, 
  openix_feb_26.mrr_lost_cancel, openix_feb_26.mrr_lost_inactivation
);

console.log("Openix data for Jan/26 and Feb/26 inserted.");
