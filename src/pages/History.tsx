import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const sessions = [
  { date: "Apr 18", duration: 2.3, angle: 19, strain: 35 },
  { date: "Apr 17", duration: 3.1, angle: 24, strain: 48 },
  { date: "Apr 16", duration: 1.8, angle: 21, strain: 30 },
  { date: "Apr 15", duration: 2.7, angle: 22, strain: 41 },
  { date: "Apr 14", duration: 1.5, angle: 17, strain: 25 },
];

const strainTone = (s: number) =>
  s >= 45 ? "text-destructive" : s >= 35 ? "text-amber-400" : "text-primary";

const History = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-md px-4 py-5">
          <h1 className="text-xl font-semibold text-foreground">History</h1>
          <p className="text-xs text-muted-foreground">Past posture sessions</p>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-3 px-4 py-6">
        {sessions.map((s) => (
          <Card key={s.date} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{s.date}</p>
                <p className="text-xs text-muted-foreground">{s.duration} hrs · avg {s.angle}°</p>
              </div>
              <div className="text-right">
                <p className={`text-base font-semibold ${strainTone(s.strain)}`}>{s.strain}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Strain</p>
              </div>
            </div>
          </Card>
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default History;
