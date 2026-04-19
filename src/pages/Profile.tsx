import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  User,
  Edit3,
  Bell,
  BellOff,
  Trash2,
  Star,
  Flame,
  Shield,
  Zap,
  Crown,
  Medal,
  ChevronRight,
  Trophy,
} from "lucide-react";

/* ────── types ────── */

type UserProfile = {
  name?: string;
  age?: string;
  sex?: string;
  height?: string;
  weight?: string;
  screenTime?: number;
  workType?: string;
  neckPain?: boolean;
  bmi?: number | null;
};

/* ────── achievement mirror (same as Challenge page) ────── */

interface Achievement {
  id: string;
  title: string;
  icon: React.ElementType;
  requirement: number;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_hour", title: "First Step", icon: Star, requirement: 1, color: "text-yellow-400" },
  { id: "five_hours", title: "Getting Stronger", icon: Flame, requirement: 5, color: "text-orange-400" },
  { id: "ten_hours", title: "Posture Warrior", icon: Shield, requirement: 10, color: "text-blue-400" },
  { id: "twenty_hours", title: "Spine Guardian", icon: Zap, requirement: 20, color: "text-purple-400" },
  { id: "fifty_hours", title: "Posture Master", icon: Crown, requirement: 50, color: "text-amber-400" },
  { id: "hundred_hours", title: "Posture Legend", icon: Medal, requirement: 100, color: "text-emerald-400" },
];

function getGoodPostureHours(): number {
  try {
    const raw = localStorage.getItem("challengeProgress");
    if (raw) return JSON.parse(raw).goodPostureHours ?? 0;
  } catch { /* noop */ }
  return 0;
}

/* ────── reusable row ────── */

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

/* ────── component ────── */

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userProfile");
      if (raw) setProfile(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  const calculatedBmi = useMemo(() => {
    const height = profile?.height ? parseFloat(profile.height) : null;
    const weight = profile?.weight ? parseFloat(profile.weight) : null;
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    const bmi = weight / Math.pow(height / 100, 2);
    if (!isFinite(bmi)) return null;
    return Math.round(bmi * 10) / 10;
  }, [profile?.height, profile?.weight]);

  const personalizationMessage = useMemo(() => {
    if (!profile || !calculatedBmi || profile.screenTime == null) {
      return "Your posture threshold is personalized based on your profile and usage.";
    }
    return `Based on your daily screen time of ${profile.screenTime} hrs/day and BMI of ${calculatedBmi}, your posture threshold is optimized for better spinal health.`;
  }, [profile, calculatedBmi]);

  const v = (val?: string | number | null) =>
    val === undefined || val === null || val === "" ? "Not set" : String(val);

  /* Earned badges */
  const goodHours = getGoodPostureHours();
  const earnedBadges = useMemo(
    () => ACHIEVEMENTS.filter((a) => goodHours >= a.requirement),
    [goodHours]
  );

  const handleResetData = () => {
    localStorage.removeItem("challengeProgress");
    toast.success("Challenge data reset");
  };

  const handleToggleNotifications = () => {
    setNotifications((prev) => !prev);
    toast.success(notifications ? "Notifications disabled" : "Notifications enabled");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with avatar */}
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-md px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/30">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {profile?.name || "CerviSense User"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {profile?.workType
                  ? `${profile.workType} • ${profile.age ?? "--"} yrs`
                  : "Posture health profile"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-6">
        {/* Details Card */}
        <Card className="border-border/50 shadow-xl shadow-primary/5 animate-fade-in">
          <CardContent className="p-5">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
              Details
            </p>
            <div className="divide-y divide-border/50">
              <Row label="Age" value={v(profile?.age)} />
              <Row
                label="Height"
                value={profile?.height ? `${profile.height} cm` : "Not set"}
              />
              <Row
                label="Weight"
                value={profile?.weight ? `${profile.weight} kg` : "Not set"}
              />
              <Row
                label="Screen Time"
                value={
                  profile?.screenTime != null
                    ? `${profile.screenTime} hrs/day`
                    : "Not set"
                }
              />
              <Row
                label="BMI"
                value={calculatedBmi != null ? String(calculatedBmi) : "Not set"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <Card
            className="border-border/50 shadow-xl shadow-primary/5 animate-fade-in"
            style={{ animationDelay: "0.05s" }}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Earned Badges
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {earnedBadges.length} / {ACHIEVEMENTS.length}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.slice(0, 3).map((ach) => (
                  <div
                    key={ach.id}
                    className="flex flex-col items-center gap-1 rounded-xl bg-muted/30 px-4 py-3 ring-1 ring-primary/10"
                  >
                    <ach.icon className={`h-6 w-6 ${ach.color}`} />
                    <span className="text-[10px] font-medium text-foreground">
                      {ach.title}
                    </span>
                  </div>
                ))}
              </div>
              {earnedBadges.length > 3 && (
                <button
                  onClick={() => navigate("/challenge")}
                  className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View all {earnedBadges.length} badges
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Personalization Insight */}
        <Card
          className="border-border/50 shadow-xl shadow-primary/5 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Personalization Insight
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {personalizationMessage}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Recommended posture angle: 22°
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card
          className="border-border/50 shadow-xl shadow-primary/5 animate-fade-in"
          style={{ animationDelay: "0.15s" }}
        >
          <CardContent className="p-5">
            <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
              Settings
            </p>
            <div className="space-y-1">
              {/* Edit Profile */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 px-3 text-sm font-normal text-foreground hover:bg-muted/50"
                onClick={() => navigate("/profile-setup")}
              >
                <Edit3 className="h-4 w-4 text-muted-foreground" />
                Edit Profile
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>

              {/* Notification Toggle */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 px-3 text-sm font-normal text-foreground hover:bg-muted/50"
                onClick={handleToggleNotifications}
              >
                {notifications ? (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                Notifications
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] px-2"
                >
                  {notifications ? "On" : "Off"}
                </Badge>
              </Button>

              {/* Reset Data */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 px-3 text-sm font-normal text-danger hover:bg-danger/10"
                onClick={handleResetData}
              >
                <Trash2 className="h-4 w-4" />
                Reset Challenge Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
