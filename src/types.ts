export type Product = string;

export interface ProductItem {
  id: number;
  name: string;
}

export interface Indicator {
  id?: number;
  month: string; // YYYY-MM
  product: Product;
  active_clients_prev: number;
  new_contracts: number;
  cancel_requests: number;
  cancelled_within_month: number;
  auto_cancellations: number;
  inactivations: number;
  mrr_total: number;
  mrr_lost_cancel: number;
  mrr_lost_inactivation: number;
}

export interface CalculatedIndicator extends Indicator {
  churn: number;
  churn_percent: number;
}
