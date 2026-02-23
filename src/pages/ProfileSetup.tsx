import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [screenTime, setScreenTime] = useState("");
  const [neckAngle, setNeckAngle] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-sm animate-fade-in border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 text-3xl font-bold tracking-tight text-primary">CerviSense</div>
          <CardTitle className="text-lg text-foreground">Profile Setup</CardTitle>
          <CardDescription>Tell us about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" placeholder="Software Engineer" value={occupation} onChange={(e) => setOccupation(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenTime">Avg. Daily Screen Time (hrs)</Label>
              <Input id="screenTime" type="number" placeholder="8" value={screenTime} onChange={(e) => setScreenTime(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neckAngle">Baseline Neck Angle (°)</Label>
              <Input id="neckAngle" type="number" placeholder="15" value={neckAngle} onChange={(e) => setNeckAngle(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Save & Continue</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
