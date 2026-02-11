/**
 * Exchange Health Monitoring
 *
 * Tracks consecutive failures per exchange and determines health status.
 * Auto-hides exchanges that fail 3+ consecutive fetches.
 */

import { ExchangeHealthStatus } from "@/types";

interface HealthRecord {
  consecutiveFailures: number;
  lastSuccess: number | null;
  lastFailure: number | null;
  lastError: string | null;
}

class ExchangeHealthMonitor {
  private records = new Map<string, HealthRecord>();

  private getOrCreate(exchangeId: string): HealthRecord {
    if (!this.records.has(exchangeId)) {
      this.records.set(exchangeId, {
        consecutiveFailures: 0,
        lastSuccess: null,
        lastFailure: null,
        lastError: null,
      });
    }
    return this.records.get(exchangeId)!;
  }

  recordSuccess(exchangeId: string): void {
    const record = this.getOrCreate(exchangeId);
    record.consecutiveFailures = 0;
    record.lastSuccess = Date.now();
    record.lastError = null;
  }

  recordFailure(exchangeId: string, error: string): void {
    const record = this.getOrCreate(exchangeId);
    record.consecutiveFailures += 1;
    record.lastFailure = Date.now();
    record.lastError = error;
  }

  getHealthStatus(exchangeId: string): ExchangeHealthStatus {
    const record = this.records.get(exchangeId);
    if (!record) return "unknown";

    if (record.consecutiveFailures === 0 && record.lastSuccess) return "healthy";
    if (record.consecutiveFailures >= 3) return "down";
    if (record.consecutiveFailures >= 1) return "degraded";
    return "unknown";
  }

  getConsecutiveFailures(exchangeId: string): number {
    return this.records.get(exchangeId)?.consecutiveFailures ?? 0;
  }

  /** Returns true if the exchange should be hidden (3+ consecutive failures) */
  shouldHide(exchangeId: string): boolean {
    return this.getConsecutiveFailures(exchangeId) >= 3;
  }

  /** Get all exchange IDs that are currently healthy or degraded (not hidden) */
  getActiveExchangeIds(): string[] {
    const active: string[] = [];
    this.records.forEach((record, id) => {
      if (record.consecutiveFailures < 3) {
        active.push(id);
      }
    });
    return active;
  }

  getLastError(exchangeId: string): string | null {
    return this.records.get(exchangeId)?.lastError ?? null;
  }

  clear(): void {
    this.records.clear();
  }

  get size(): number {
    return this.records.size;
  }
}

export const exchangeHealth = new ExchangeHealthMonitor();
