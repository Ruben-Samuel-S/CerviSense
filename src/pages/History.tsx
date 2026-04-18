import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sessions = [
  { date: "Apr 18", duration: 2.3, angle: 19, strain: 35 },
  { date: "Apr 17", duration: 3.1, angle: 24, strain: 48 },
  { date: "Apr 16", duration: 1.8, angle: 21, strain: 30 },
  { date: "Apr 15", duration: 2.7, angle: 22, strain: 41 },
  { date: "Apr 14", duration: 1.5, angle: 17, strain: 25 },
];

const statusFor = (strain: number) =>
  strain >= 45
    ? { label: "Bad", tone: "text-destructive" }
    : strain >= 35
    ? { label: "Risk", tone: "text-amber-400" }
    : { label: "Good", tone: "text-primary" };

const History = () => {
  const [filter, setFilter] = useState("all");

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
