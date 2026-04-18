import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, AlertTriangle, Clock, Watch, ArrowDown, FileText } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const mockData = [
  { time: "9:00", angle: 12 }, { time: "9:30", angle: 18 }, { time: "10:00", angle: 22 },
  { time: "10:30", angle: 15 }, { time: "11:00", angle: 28 }, { time: "11:30", angle: 35 },
  { time: "12:00", angle: 20 }, { time: "12:30", angle: 14 }, { time: "13:00", angle: 10 },
  { time: "13:30", angle: 25 }, { time: "14:00", angle: 18 },
];

const currentAngle = 18;
const confidence = 94;
const personalizedThreshold = 20;
const healthScore = 76;
const forwardHeadIndex = 32;
const avgCorrectionTime = 4.2;
const activeWearTime = 4.5;
const weeklyImprovement = 12;
const sparklineData = [
  { v: 5 }, { v: 8 }, { v: 6 }, { v: 10 }, { v: 9 }, { v: 11 }, { v: 12 },
];

const getStatus = (angle: number) => {
  if (angle <= 15) return { label: "Good", color: "bg-success text-background", dot: "bg-success" };
  if (angle <= 25) return { label: "Risk", color: "bg-warning text-background", dot: "bg-warning" };
  return { label: "Bad", color: "bg-danger text-foreground", dot: "bg-danger" };
};

const getRiskLevel = (fhi: number) => {
  if (fhi < 25) return { label: "Low", color: "text-success" };
  if (fhi <= 50) return { label: "Medium", color: "text-warning" };
  return { label: "High", color: "text-danger" };
};

const getFhiBadge = (fhi: number) => {
  if (fhi < 25) return { label: "Normal", color: "bg-success text-background" };
  if (fhi <= 50) return { label: "Elevated", color: "bg-warning text-background" };
  return { label: "High Risk", color: "bg-danger text-foreground" };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const status = getStatus(currentAngle);
  const risk = getRiskLevel(forwardHeadIndex);
  const fhiBadge = getFhiBadge(forwardHeadIndex);
  const [lastGenerated, setLastGenerated] = useState<string>("--");

  const handleGenerate = (type: "Weekly" | "Monthly") => {
    const ts = new Date().toLocaleString();
    setLastGenerated(`${type} • ${ts}`);
    toast.success(`${type} report generated`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 pb-24">
      <div className="mx-auto max-w-md space-y-5">
        {/* Header */}
        <div className="animate-fade-in text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">CerviSense</h1>
          <p className="text-sm text-muted-foreground">Track. Analyze. Align.</p>
        </div>

        {/* Top Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center py-3 px-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Posture</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                <span className="text-sm font-bold text-foreground">{status.label}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center py-3 px-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Angle</p>
              <p className="mt-1 text-sm font-bold text-primary">{currentAngle}°</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center py-3 px-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Risk</p>
              <p className={`mt-1 text-sm font-bold ${risk.color}`}>{risk.label}</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Angle */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.1s" }}>
          <CardContent className="flex flex-col items-center py-8">
            <Activity className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">Current Neck Angle</p>
            <div className="mt-1 text-6xl font-bold tracking-tighter text-foreground">{currentAngle}°</div>
            <p className="mt-1 text-xs text-muted-foreground">Confidence {confidence}%</p>
            <Badge className={`mt-3 ${status.color} border-0 px-4 py-1 text-sm font-semibold`}>{status.label}</Badge>
            <p className="mt-2 text-[11px] text-muted-foreground">Personalized threshold: {personalizedThreshold}°</p>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.2s" }}>
          <CardContent className="flex flex-col items-center py-6">
            <TrendingUp className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Health Score</p>
            <div className="mt-1 text-5xl font-bold text-primary">{healthScore}</div>
            <p className="text-xs text-muted-foreground">out of 100</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Based on personalized AI model</p>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.3s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Posture Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 25%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} stroke="hsl(217 33% 25%)" />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} stroke="hsl(217 33% 25%)" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(217 33% 17%)", border: "1px solid hsl(217 33% 25%)", borderRadius: "8px", color: "hsl(210 40% 98%)" }} />
                <Line type="monotone" dataKey="angle" stroke="hsl(168 80% 40%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(168 80% 40%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clinical Metrics */}
        <div className="animate-fade-in" style={{ animationDelay: "0.35s" }}>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Clinical Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Neck Risk % */}
            <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.4s" }}>
              <CardContent className="flex flex-col items-center py-5 px-3">
                <AlertTriangle className="mb-1 h-5 w-5 text-warning" />
                <p className="text-xs text-muted-foreground">Neck Risk %</p>
                <div className="mt-1 text-3xl font-bold text-foreground">{forwardHeadIndex}%</div>
                <Badge className={`mt-2 ${fhiBadge.color} border-0 px-3 py-0.5 text-xs font-semibold`}>{fhiBadge.label}</Badge>
                <p className="mt-1 text-center text-[10px] text-muted-foreground">Time above safe posture</p>
              </CardContent>
            </Card>

            {/* Recovery Time */}
            <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.45s" }}>
              <CardContent className="flex flex-col items-center py-5 px-3">
                <Clock className="mb-1 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">Recovery Time</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-3xl font-bold text-foreground">{avgCorrectionTime}</span>
                  <span className="text-sm text-muted-foreground">sec</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-primary">
                  <ArrowDown className="h-3 w-3" />
                  <span className="text-xs font-medium">Improving</span>
                </div>
                <p className="mt-1 text-center text-[10px] text-muted-foreground">Avg time to neutral</p>
              </CardContent>
            </Card>

            {/* Active Wear Time */}
            <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.5s" }}>
              <CardContent className="flex flex-col items-center py-5 px-3">
                <Watch className="mb-1 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">Active Wear Time</p>
                <div className="mt-1 text-3xl font-bold text-foreground">{activeWearTime} <span className="text-sm font-normal text-muted-foreground">hrs</span></div>
                <Progress value={(activeWearTime / 6) * 100} className="mt-2 h-2 w-full" />
                <p className="mt-1 text-[10px] text-muted-foreground">of 6 hr goal</p>
              </CardContent>
            </Card>

            {/* Posture Improvement */}
            <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.55s" }}>
              <CardContent className="flex flex-col items-center py-5 px-3">
                <TrendingUp className="mb-1 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">Posture Improvement</p>
                <div className={`mt-1 text-3xl font-bold ${weeklyImprovement >= 0 ? "text-primary" : "text-danger"}`}>
                  {weeklyImprovement > 0 ? "+" : ""}{weeklyImprovement}%
                </div>
                <p className="text-[10px] text-muted-foreground">vs last week</p>
                <div className="mt-1 w-full">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={sparklineData}>
                      <Line type="monotone" dataKey="v" stroke="hsl(168 80% 40%)" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Health Reports */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.58s" }}>
          <CardContent className="py-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Health Reports</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleGenerate("Weekly")}>
                Generate Weekly
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGenerate("Monthly")}>
                Generate Monthly
              </Button>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Last generated: {lastGenerated}</p>
          </CardContent>
        </Card>

        {/* View Reports */}
        <Button onClick={() => navigate("/reports")} className="w-full animate-fade-in" style={{ animationDelay: "0.6s" }}>
          View Reports
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
