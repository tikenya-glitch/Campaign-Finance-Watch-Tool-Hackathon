// Types for the FedhaWatch contract JSON
export interface Source {
  source_org: string | null;
  source_url: string | null;
  doc_id: string | null;
  page_number: number | null;
}

export type RiskLevel = "GREEN" | "YELLOW" | "RED" | "BLUE" | "USI" | "INSUFFICIENT_DATA";
export type EntityType = "party" | "candidate";
export type ReportingStatus = "FILED" | "NOT_FILED";

export interface Entity {
  entity_id: string;
  entity_type: EntityType;
  display_name: string;

  party_entity_id: string | null;

  county: string | null;
  constituency: string | null;
  ward: string | null;

  reported_spend_kes: number | null;
  shadow_spend_kes: number;

  gap_percent: number | null;

  risk_level: RiskLevel;
  label: string;
  drivers: string[];

  reporting_status: ReportingStatus;

  // optional fields
  reported_metric?: string | null;
  reconciliation_status?: string | null;
  chosen_source_org?: string | null;
  sources?: Source[];
}

export interface FedhaWatchContract {
  generated_at: string;
  period_start: string;
  period_end: string;
  entities: Entity[];
}

// Fetch the contract data
export async function fetchContract(): Promise<FedhaWatchContract> {
  const res = await fetch("../../fedhawatch-t2-backend/outputs/fedhawatch_contract.json");
  if (!res.ok) throw new Error("Failed to load contract data");
  return res.json();
}

// Format KES currency
export function formatKES(amount: number | null): string {
  if (amount === null || amount === undefined) return "N/A";
  return `KES ${amount.toLocaleString("en-KE")}`;
}

// Format gap percent
export function formatGap(gap: number | null): string {
  if (gap === null || gap === undefined) return "N/A";
  const sign = gap > 0 ? "+" : "";
  return `${sign}${gap.toFixed(1)}%`;
}

// Resolve party name from entities
export function resolvePartyName(entity: Entity, entities: Entity[]): string {
  if (entity.entity_type !== "candidate") return "";
  if (!entity.party_entity_id) return "Independent";
  const party = entities.find((e) => e.entity_id === entity.party_entity_id);
  return party?.display_name ?? "Unknown Party";
}

// Risk level ordering for severity sort
const RISK_SEVERITY: Record<RiskLevel, number> = {
  RED: 0,
  USI: 1,
  YELLOW: 2,
  BLUE: 3,
  INSUFFICIENT_DATA: 4,
  GREEN: 5,
};

export function riskSeverity(level: RiskLevel): number {
  return RISK_SEVERITY[level] ?? 99;
}

// Risk color map for charts
export const RISK_COLORS: Record<RiskLevel, string> = {
  GREEN: "hsl(142, 60%, 40%)",
  YELLOW: "hsl(45, 93%, 47%)",
  RED: "hsl(0, 72%, 51%)",
  BLUE: "hsl(210, 70%, 50%)",
  USI: "hsl(270, 50%, 40%)",
  INSUFFICIENT_DATA: "hsl(215, 14%, 60%)",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  GREEN: "Within expected range",
  YELLOW: "Transparency concern",
  RED: "Unexplained expenditure spike",
  BLUE: "Underutilization anomaly",
  USI: "No disclosure filed",
  INSUFFICIENT_DATA: "Not enough observations",
};

// Get unique counties from entities
export function getUniqueCounties(entities: Entity[]): string[] {
  const counties = new Set<string>();
  entities.forEach((e) => {
    if (e.county) counties.add(e.county);
  });
  return Array.from(counties).sort();
}
