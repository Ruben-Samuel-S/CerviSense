import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

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

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userProfile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const v = (val?: string | number | null) =>
    val === undefined || val === null || val === "" ? "—" : String(val);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-md px-4 py-5">
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
          <p className="text-xs text-muted-foreground">
            {profile?.name ? profile.name : "User profile information"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 py-6">
        <Card className="p-4">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Details</p>
          <div className="divide-y divide-border/50">
            <Row label="Age" value={v(profile?.age)} />
            <Row label="Height" value={profile?.height ? `${profile.height} cm` : "—"} />
            <Row label="Weight" value={profile?.weight ? `${profile.weight} kg` : "—"} />
            <Row
              label="Screen Time"
              value={profile?.screenTime != null ? `${profile.screenTime} hrs/day` : "—"}
            />
            <Row label="BMI" value={profile?.bmi != null ? String(profile.bmi) : "—"} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Personalization Insight</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your posture threshold is personalized based on your profile and usage.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
