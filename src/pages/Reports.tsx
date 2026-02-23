import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ArrowLeft } from "lucide-react";

const dailyData = [
  { hour: "8AM", angle: 12 }, { hour: "9AM", angle: 18 }, { hour: "10AM", angle: 25 },
  { hour: "11AM", angle: 30 }, { hour: "12PM", angle: 15 }, { hour: "1PM", angle: 20 },
  { hour: "2PM", angle: 28 }, { hour: "3PM", angle: 22 }, { hour: "4PM", angle: 35 },
  { hour: "5PM", angle: 18 }, { hour: "6PM", angle: 14 },
];

const weeklyData = [
  { day: "Mon", avg: 18 }, { day: "Tue", avg: 22 }, { day: "Wed", avg: 20 },
  { day: "Thu", avg: 26 }, { day: "Fri", avg: 24 }, { day: "Sat", avg: 15 },
  { day: "Sun", avg: 12 },
];

const chartStyle = {
  backgroundColor: "hsl(217 33% 17%)",
  border: "1px solid hsl(217 33% 25%)",
  borderRadius: "8px",
  color: "hsl(210 40% 98%)",
};

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-md space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { label: "Avg Angle", value: "19.7°" },
            { label: "Poor Duration", value: "2.4 hrs" },
            { label: "Strain Score", value: "38" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-lg shadow-primary/5">
              <CardContent className="flex flex-col items-center py-4 px-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-primary">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Report */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.2s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Daily Report</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 25%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} stroke="hsl(217 33% 25%)" />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} stroke="hsl(217 33% 25%)" />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="angle" fill="hsl(168 80% 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Report */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.3s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Weekly Report</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 25%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} stroke="hsl(217 33% 25%)" />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} stroke="hsl(217 33% 25%)" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="avg" stroke="hsl(168 80% 40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(168 80% 40%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
