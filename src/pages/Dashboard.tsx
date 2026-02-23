import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp } from "lucide-react";

const mockData = [
  { time: "9:00", angle: 12 },
  { time: "9:30", angle: 18 },
  { time: "10:00", angle: 22 },
  { time: "10:30", angle: 15 },
  { time: "11:00", angle: 28 },
  { time: "11:30", angle: 35 },
  { time: "12:00", angle: 20 },
  { time: "12:30", angle: 14 },
  { time: "13:00", angle: 10 },
  { time: "13:30", angle: 25 },
  { time: "14:00", angle: 18 },
];

const currentAngle = 18;
const healthScore = 76;

const getStatus = (angle: number) => {
  if (angle <= 15) return { label: "Good", color: "bg-success text-background" };
  if (angle <= 25) return { label: "Moderate", color: "bg-warning text-background" };
  return { label: "Poor", color: "bg-danger text-foreground" };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const status = getStatus(currentAngle);

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-md space-y-5">
        {/* Header */}
        <div className="animate-fade-in text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">CerviSense</h1>
          <p className="text-sm text-muted-foreground">Track. Analyze. Align.</p>
        </div>

        {/* Current Angle */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.1s" }}>
          <CardContent className="flex flex-col items-center py-8">
            <Activity className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">Current Neck Angle</p>
            <div className="mt-1 text-6xl font-bold tracking-tighter text-foreground">
              {currentAngle}°
            </div>
            <Badge className={`mt-3 ${status.color} border-0 px-4 py-1 text-sm font-semibold`}>
              {status.label}
            </Badge>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.2s" }}>
          <CardContent className="flex flex-col items-center py-6">
            <TrendingUp className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Health Score</p>
            <div className="mt-1 text-5xl font-bold text-primary">{healthScore}</div>
            <p className="text-xs text-muted-foreground">out of 100</p>
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(217 33% 17%)",
                    border: "1px solid hsl(217 33% 25%)",
                    borderRadius: "8px",
                    color: "hsl(210 40% 98%)",
                  }}
                />
                <Line type="monotone" dataKey="angle" stroke="hsl(168 80% 40%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(168 80% 40%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* View Reports */}
        <Button onClick={() => navigate("/reports")} className="w-full animate-fade-in" style={{ animationDelay: "0.4s" }}>
          View Reports
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
