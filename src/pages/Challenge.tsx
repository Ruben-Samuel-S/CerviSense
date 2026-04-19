import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Target,
  Clock,
  Star,
  Shield,
  Zap,
  Award,
  Crown,
  Medal,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

/* ────── achievement definitions ────── */

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requirement: number; // hours of good posture needed
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_hour",
    title: "First Step",
    description: "1 hour of good posture",
    icon: Star,
    requirement: 1,
    color: "text-yellow-400",
  },
  {
    id: "five_hours",
    title: "Getting Stronger",
    description: "5 hours of good posture",
    icon: Flame,
    requirement: 5,
    color: "text-orange-400",
  },
  {
    id: "ten_hours",
    title: "Posture Warrior",
    description: "10 hours streak",
    icon: Shield,
    requirement: 10,
    color: "text-blue-400",
  },
  {
    id: "twenty_hours",
    title: "Spine Guardian",
    description: "20 hours of discipline",
    icon: Zap,
    requirement: 20,
    color: "text-purple-400",
  },
  {
    id: "fifty_hours",
    title: "Posture Master",
    description: "50 hours – true dedication",
    icon: Crown,
    requirement: 50,
    color: "text-amber-400",
  },
  {
    id: "hundred_hours",
    title: "Posture Legend",
    description: "100 hours – elite status",
    icon: Medal,
    requirement: 100,
    color: "text-emerald-400",
  },
];

/* ────── helper: load / save progress from localStorage ────── */

interface ChallengeProgress {
  goodPostureHours: number;
  dailyStreak: number;
  lastActiveDate: string;
  monthlyGoalHours: number;
}

function loadProgress(): ChallengeProgress {
  try {
    const raw = localStorage.getItem("challengeProgress");
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return {
    goodPostureHours: 4.2,
    dailyStreak: 3,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    monthlyGoalHours: 40,
  };
}

function saveProgress(p: ChallengeProgress) {
  localStorage.setItem("challengeProgress", JSON.stringify(p));
}

/* ────── component ────── */

const Challenge = () => {
  const [progress, setProgress] = useState<ChallengeProgress>(loadProgress);

  // Persist on change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Simulate a small increment every 30 s while page is open (mock live tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        goodPostureHours: Math.round((prev.goodPostureHours + 0.01) * 100) / 100,
      }));
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const monthlyPct = Math.min(
    100,
    Math.round((progress.goodPostureHours / progress.monthlyGoalHours) * 100)
  );

  const earned = useMemo(
    () => ACHIEVEMENTS.filter((a) => progress.goodPostureHours >= a.requirement),
    [progress.goodPostureHours]
  );

  const nextAchievement = useMemo(
    () => ACHIEVEMENTS.find((a) => progress.goodPostureHours < a.requirement) ?? null,
    [progress.goodPostureHours]
  );

  const nextPct = nextAchievement
    ? Math.min(
        100,
        Math.round((progress.goodPostureHours / nextAchievement.requirement) * 100)
      )
    : 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* header */}
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-md px-4 py-5">
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" /> Posture Challenge
          </h1>
          <p className="text-xs text-muted-foreground">
            Stay consistent. Earn achievements.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-6">
        {/* Monthly Challenge Card */}
        <Card className="border-border/50 shadow-xl shadow-primary/5 animate-fade-in">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Monthly Challenge</p>
                <p className="text-xs text-muted-foreground">
                  Maintain good posture for {progress.monthlyGoalHours} hours this month
                </p>
              </div>
            </div>
            <div className="text-center mb-3">
              <span className="text-4xl font-bold text-primary">
                {progress.goodPostureHours}
              </span>
              <span className="text-lg text-muted-foreground ml-1">
                / {progress.monthlyGoalHours} hrs
              </span>
            </div>
            <Progress value={monthlyPct} className="h-3 mb-2" />
            <p className="text-center text-xs text-muted-foreground">{monthlyPct}% complete</p>
          </CardContent>
        </Card>

        {/* Stats Strip */}
        <div
          className="grid grid-cols-3 gap-2 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center py-3 px-2">
              <Flame className="h-4 w-4 text-orange-400 mb-1" />
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Streak
              </p>
              <p className="text-sm font-bold text-foreground">
                {progress.dailyStreak} days
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center py-3 px-2">
              <Clock className="h-4 w-4 text-primary mb-1" />
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Good Hours
              </p>
              <p className="text-sm font-bold text-foreground">
                {progress.goodPostureHours}h
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center py-3 px-2">
              <Award className="h-4 w-4 text-yellow-400 mb-1" />
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Badges
              </p>
              <p className="text-sm font-bold text-foreground">{earned.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Achievement */}
        {nextAchievement && (
          <Card
            className="border-border/50 shadow-xl shadow-primary/5 animate-fade-in"
            style={{ animationDelay: "0.15s" }}
          >
            <CardContent className="py-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Next Achievement
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <nextAchievement.icon
                    className={`h-6 w-6 ${nextAchievement.color} opacity-50`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {nextAchievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {nextAchievement.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {nextPct}%
                </Badge>
              </div>
              <Progress value={nextPct} className="h-2" />
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                {Math.max(
                  0,
                  Math.round((nextAchievement.requirement - progress.goodPostureHours) * 10) / 10
                )}{" "}
                hrs to go
              </p>
            </CardContent>
          </Card>
        )}

        {/* Achievements Grid */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="mb-3 text-sm font-medium text-muted-foreground">Achievements</p>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = progress.goodPostureHours >= ach.requirement;
              return (
                <Card
                  key={ach.id}
                  className={`border-border/50 shadow-lg transition-all duration-300 ${
                    unlocked
                      ? "shadow-primary/10 ring-1 ring-primary/20"
                      : "opacity-40 grayscale"
                  }`}
                >
                  <CardContent className="flex flex-col items-center py-4 px-2">
                    <ach.icon
                      className={`h-7 w-7 mb-1.5 ${unlocked ? ach.color : "text-muted-foreground"}`}
                    />
                    <p className="text-[11px] font-semibold text-foreground text-center leading-tight">
                      {ach.title}
                    </p>
                    <p className="text-[9px] text-muted-foreground text-center mt-0.5">
                      {ach.description}
                    </p>
                    {unlocked && (
                      <Badge className="mt-1.5 bg-primary/20 text-primary border-0 text-[9px] px-2 py-0">
                        Earned
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Challenge;
