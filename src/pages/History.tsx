import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ────── mock session data ────── */
// Latest 3 days: Good posture (strain < 35) → matches 3-day streak
// Remaining days: mixed statuses for variety

const sessions = [
  { date: "Apr 18", duration: 2.5, angle: 14, strain: 18 },  // Good
  { date: "Apr 17", duration: 3.1, angle: 16, strain: 22 },  // Good
  { date: "Apr 16", duration: 1.9, angle: 18, strain: 28 },  // Good
  { date: "Apr 15", duration: 2.7, angle: 26, strain: 42 },  // Risk
  { date: "Apr 14", duration: 1.5, angle: 32, strain: 52 },  // Bad
  { date: "Apr 13", duration: 2.2, angle: 15, strain: 20 },  // Good
  { date: "Apr 12", duration: 1.8, angle: 28, strain: 46 },  // Bad
  { date: "Apr 11", duration: 2.4, angle: 23, strain: 38 },  // Risk
  { date: "Apr 10", duration: 2.0, angle: 13, strain: 16 },  // Good
];

const statusFor = (strain: number) =>
  strain >= 45
    ? { label: "Bad", tone: "text-destructive" }
    : strain >= 35
    ? { label: "Risk", tone: "text-amber-400" }
    : { label: "Good", tone: "text-primary" };

/* ────── compute streak: consecutive "Good" days from the top ────── */

function computeStreak(): number {
  let streak = 0;
  for (const s of sessions) {
    const status = statusFor(s.strain);
    if (status.label === "Good") {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/* ────── sync streak to Challenge localStorage ────── */

function syncStreakToChallenge(streak: number) {
  try {
    const raw = localStorage.getItem("challengeProgress");
    const progress = raw
      ? JSON.parse(raw)
      : {
          goodPostureHours: 4.2,
          dailyStreak: streak,
          lastActiveDate: new Date().toISOString().slice(0, 10),
          monthlyGoalHours: 40,
        };
    progress.dailyStreak = streak;
    localStorage.setItem("challengeProgress", JSON.stringify(progress));
  } catch {
    /* noop */
  }
}

const History = () => {
  const [filter, setFilter] = useState("all");

  // Sync streak on mount so Challenge page shows the correct value
  useEffect(() => {
    const streak = computeStreak();
    syncStreakToChallenge(streak);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-md px-4 py-5">
          <h1 className="text-xl font-semibold text-foreground">History</h1>
          <p className="text-xs text-muted-foreground">Past posture sessions</p>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-3 px-4 py-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        {sessions.map((s) => {
          const status = statusFor(s.strain);
          return (
            <Card key={s.date} className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.duration} hrs · avg {s.angle}°
                  </p>
                </div>
                <span className={`text-xs font-semibold ${status.tone}`}>{status.label}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                <span>Strain Score: <span className="font-medium text-foreground">{s.strain}</span></span>
                <span>Status: <span className={`font-medium ${status.tone}`}>{status.label}</span></span>
              </div>
            </Card>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
};

export default History;
