import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, PostureLog } from "@/lib/supabase";

const TABLE = "posture_logs";

/* ────── derived-metric helpers ────── */

/** Percentage of readings where angle > 25 */
function calcNeckRisk(rows: PostureLog[]): number {
  if (rows.length === 0) return 0;
  const bad = rows.filter((r) => r.angle > 25).length;
  return Math.round((bad / rows.length) * 100);
}

/** Hours between first and last timestamp */
function calcActiveWearTime(rows: PostureLog[]): number {
  if (rows.length < 2) return 0;
  const first = new Date(rows[0].timestamp).getTime();
  const last = new Date(rows[rows.length - 1].timestamp).getTime();
  const hrs = (last - first) / 3_600_000;
  return Math.round(hrs * 10) / 10; // 1 decimal
}

/** Compare avg of last 20 vs previous 20 → % improvement (lower angle = better) */
function calcPostureImprovement(rows: PostureLog[]): number {
  if (rows.length < 2) return 0;
  const recent = rows.slice(-20);
  const previous = rows.slice(-40, -20);
  if (previous.length === 0) return 0;
  const avgRecent = recent.reduce((s, r) => s + r.angle, 0) / recent.length;
  const avgPrev = previous.reduce((s, r) => s + r.angle, 0) / previous.length;
  if (avgPrev === 0) return 0;
  // positive = improvement (angle decreased)
  return Math.round(((avgPrev - avgRecent) / avgPrev) * 100);
}

/** Average seconds from bad (>25) to good (<20) */
function calcRecoveryTime(rows: PostureLog[]): number {
  if (rows.length < 2) return 0;
  const recoveries: number[] = [];
  let badStart: number | null = null;

  for (const r of rows) {
    const t = new Date(r.timestamp).getTime();
    if (r.angle > 25 && badStart === null) {
      badStart = t;
    } else if (r.angle < 20 && badStart !== null) {
      recoveries.push((t - badStart) / 1000); // seconds
      badStart = null;
    }
  }
  if (recoveries.length === 0) return 0;
  const avg = recoveries.reduce((s, v) => s + v, 0) / recoveries.length;
  return Math.round(avg * 10) / 10;
}

/* ────── hook return type ────── */

export interface PostureMetrics {
  /* live values */
  currentAngle: number;
  postureStatus: string;
  confidence: number;

  /* trend chart data (last 50) */
  trendData: { time: string; angle: number }[];

  /* health score (last 20) */
  healthScore: number;

  /* derived */
  neckRisk: number;
  activeWearTime: number;
  postureImprovement: number;
  recoveryTime: number;

  /* sparkline for improvement card */
  sparklineData: { v: number }[];

  /* meta */
  loading: boolean;
  error: string | null;
}

/* ────── the hook ────── */

export function usePostureData(pollMs = 2000): PostureMetrics {
  const [latest, setLatest] = useState<PostureLog | null>(null);
  const [history, setHistory] = useState<PostureLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Fetch latest single row */
  const fetchLatest = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from(TABLE)
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (err) throw err;
      if (data) setLatest(data as PostureLog);
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch latest reading");
    }
  }, []);

  /* Fetch last 50 rows for trend + analytics */
  const fetchHistory = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from(TABLE)
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (err) throw err;
      if (data) {
        // reverse so oldest first (for chart)
        setHistory((data as PostureLog[]).reverse());
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  }, []);

  /* Initial fetch + polling */
  useEffect(() => {
    fetchLatest();
    fetchHistory();

    intervalRef.current = setInterval(() => {
      fetchLatest();
      fetchHistory();
    }, pollMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchLatest, fetchHistory, pollMs]);

  /* ── compute derived values ── */

  const currentAngle = latest?.angle ?? 0;
  const postureStatus = latest?.status ?? "Unknown";
  const confidence = latest?.confidence ?? 0;

  // Health score: 100 - average(angle) of last 20, clamped 0–100
  const last20 = history.slice(-20);
  const avgAngle =
    last20.length > 0
      ? last20.reduce((s, r) => s + r.angle, 0) / last20.length
      : 0;
  const healthScore = Math.min(100, Math.max(0, Math.round(100 - avgAngle)));

  // Trend data for chart
  const trendData = history.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    angle: r.angle,
  }));

  // Derived metrics
  const neckRisk = calcNeckRisk(history);
  const activeWearTime = calcActiveWearTime(history);
  const postureImprovement = calcPostureImprovement(history);
  const recoveryTime = calcRecoveryTime(history);

  // Sparkline: last 7 readings
  const sparklineData = history.slice(-7).map((r) => ({ v: r.angle }));

  return {
    currentAngle,
    postureStatus,
    confidence,
    trendData,
    healthScore,
    neckRisk,
    activeWearTime,
    postureImprovement,
    recoveryTime,
    sparklineData,
    loading,
    error,
  };
}
