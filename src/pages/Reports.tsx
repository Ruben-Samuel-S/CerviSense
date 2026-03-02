import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
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

const fhiTrendData = [
  { day: "Mon", fhi: 28 }, { day: "Tue", fhi: 35 }, { day: "Wed", fhi: 32 },
  { day: "Thu", fhi: 40 }, { day: "Fri", fhi: 30 }, { day: "Sat", fhi: 25 },
  { day: "Sun", fhi: 22 },
];

const correctionLatencyData = [
  { day: "Mon", latency: 5.1 }, { day: "Tue", latency: 4.8 }, { day: "Wed", latency: 4.5 },
  { day: "Thu", latency: 4.9 }, { day: "Fri", latency: 4.2 }, { day: "Sat", latency: 3.8 },
  { day: "Sun", latency: 3.5 },
];

const complianceData = [
  { day: "Mon", hours: 5.2 }, { day: "Tue", hours: 4.8 }, { day: "Wed", hours: 6.1 },
  { day: "Thu", hours: 5.5 }, { day: "Fri", hours: 4.0 }, { day: "Sat", hours: 3.2 },
  { day: "Sun", hours: 2.8 },
];

const strainCorrelationData = [
  { day: "Mon", strain: 35, fhi: 28 }, { day: "Tue", strain: 42, fhi: 35 },
  { day: "Wed", strain: 38, fhi: 32 }, { day: "Thu", strain: 48, fhi: 40 },
  { day: "Fri", strain: 36, fhi: 30 }, { day: "Sat", strain: 28, fhi: 25 },
  { day: "Sun", strain: 22, fhi: 22 },
];

const chartStyle = {
  backgroundColor: "hsl(217 33% 17%)",
  border: "1px solid hsl(217 33% 25%)",
  borderRadius: "8px",
  color: "hsl(210 40% 98%)",
};

const tickStyle = { fill: "hsl(215 20% 55%)", fontSize: 10 };
const gridStroke = "hsl(217 33% 25%)";

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
        <div className="grid grid-cols-4 gap-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { label: "Avg Angle", value: "19.7°" },
            { label: "Poor Dur.", value: "2.4 hrs" },
            { label: "Strain", value: "38" },
            { label: "FHI Avg", value: "32%" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-lg shadow-primary/5">
              <CardContent className="flex flex-col items-center py-3 px-1">
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-lg font-bold text-primary">{stat.value}</p>
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
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="hour" tick={tickStyle} stroke={gridStroke} />
                <YAxis tick={tickStyle} stroke={gridStroke} />
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
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={tickStyle} stroke={gridStroke} />
                <YAxis tick={tickStyle} stroke={gridStroke} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="avg" stroke="hsl(168 80% 40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(168 80% 40%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* FHI Trend */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.4s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">FHI Trend Over Time</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fhiTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={tickStyle} stroke={gridStroke} />
                <YAxis tick={tickStyle} stroke={gridStroke} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="fhi" stroke="hsl(168 80% 40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(168 80% 40%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Correction Latency Trend */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.5s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Correction Latency Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={correctionLatencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={tickStyle} stroke={gridStroke} />
                <YAxis tick={tickStyle} stroke={gridStroke} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="latency" stroke="hsl(45 93% 58%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(45 93% 58%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Duration */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.6s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Compliance Duration</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={tickStyle} stroke={gridStroke} />
                <YAxis tick={tickStyle} stroke={gridStroke} />
                <Tooltip contentStyle={chartStyle} />
                <ReferenceLine y={6} stroke="hsl(215 20% 55%)" strokeDasharray="3 3" label={{ value: "Goal", fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                <Bar dataKey="hours" fill="hsl(168 80% 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strain Correlation */}
        <Card className="animate-fade-in border-border/50 shadow-xl shadow-primary/5" style={{ animationDelay: "0.7s" }}>
          <CardContent className="pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Strain Score vs FHI Correlation</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={strainCorrelationData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={tickStyle} stroke={gridStroke} />
                <YAxis tick={tickStyle} stroke={gridStroke} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="strain" stroke="hsl(45 93% 58%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(45 93% 58%)" }} name="Strain" />
                <Line type="monotone" dataKey="fhi" stroke="hsl(168 80% 40%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(168 80% 40%)" }} name="FHI" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
