import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { User, Activity, Monitor, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

type FormData = {
  name: string;
  age: string;
  sex: string;
  height: string;
  weight: string;
  screenTime: number;
  workType: string;
  neckPain: boolean;
};

const initialData: FormData = {
  name: "",
  age: "",
  sex: "",
  height: "",
  weight: "",
  screenTime: 6,
  workType: "",
  neckPain: false,
};

const bmiCategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const bmi = useMemo(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (!h || !w) return null;
    const v = w / Math.pow(h / 100, 2);
    if (!isFinite(v) || v <= 0) return null;
    return Math.round(v * 10) / 10;
  }, [formData.height, formData.weight]);

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!formData.name.trim()) e.name = "Name is required";
      const age = parseInt(formData.age);
      if (!age || age < 10 || age > 80) e.age = "Age must be between 10 and 80";
      if (!formData.sex) e.sex = "Please select an option";
    }
    if (s === 2) {
      const h = parseFloat(formData.height);
      const w = parseFloat(formData.weight);
      if (!h || h < 100 || h > 220) e.height = "Height must be 100–220 cm";
      if (!w || w < 30 || w > 150) e.weight = "Weight must be 30–150 kg";
    }
    if (s === 3) {
      if (!formData.workType) e.workType = "Please select work type";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      localStorage.setItem("userProfile", JSON.stringify({ ...formData, bmi }));
      setDone(true);
    }
  };

  const handleBack = () => step > 1 && setStep(step - 1);

  const stepMeta = [
    { icon: User, title: "Basic Info", desc: "Tell us about yourself" },
    { icon: Activity, title: "Body Metrics", desc: "Help us personalize for you" },
    { icon: Monitor, title: "Usage Pattern", desc: "Your daily habits" },
  ][step - 1];

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <Card className="w-full max-w-sm animate-fade-in border-border/50 shadow-2xl shadow-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Profile created successfully</h2>
            <p className="text-sm text-muted-foreground">Your personalized CerviSense experience is ready.</p>
            <Button className="mt-2 w-full" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StepIcon = stepMeta.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-sm animate-fade-in border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="space-y-3">
          <div className="text-center text-2xl font-bold tracking-tight text-primary">CerviSense</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-1.5" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <StepIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-foreground">{stepMeta.title}</CardTitle>
              <CardDescription className="text-xs">{stepMeta.desc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Jane Doe" value={formData.name} onChange={(e) => update("name", e.target.value)} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="25" value={formData.age} onChange={(e) => update("age", e.target.value)} />
                {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select value={formData.sex} onValueChange={(v) => update("sex", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-xs text-destructive">{errors.sex}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" placeholder="170" value={formData.height} onChange={(e) => update("height", e.target.value)} />
                {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" placeholder="65" value={formData.weight} onChange={(e) => update("weight", e.target.value)} />
                {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
              </div>
              <div className="rounded-md border border-border/50 bg-muted/30 px-3 py-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">BMI</span>
                  {bmi ? (
                    <span className="font-semibold text-foreground">
                      {bmi} <span className="ml-1 text-xs font-normal text-primary">{bmiCategory(bmi)}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Enter height & weight</span>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Avg. Screen Time</Label>
                  <span className="text-sm font-medium text-primary">{formData.screenTime} hrs/day</span>
                </div>
                <Slider
                  min={0}
                  max={16}
                  step={1}
                  value={[formData.screenTime]}
                  onValueChange={(v) => update("screenTime", v[0])}
                />
              </div>
              <div className="space-y-2">
                <Label>Work Type</Label>
                <Select value={formData.workType} onValueChange={(v) => update("workType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select work type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workType && <p className="text-xs text-destructive">{errors.workType}</p>}
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/50 bg-muted/30 px-3 py-2.5">
                <div>
                  <Label htmlFor="neckPain" className="text-sm">Experiencing neck pain?</Label>
                  <p className="text-xs text-muted-foreground">Helps tune alert sensitivity</p>
                </div>
                <Switch id="neckPain" checked={formData.neckPain} onCheckedChange={(v) => update("neckPain", v)} />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            {step > 1 && (
              <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <Button type="button" className="flex-1" onClick={handleNext}>
              {step === 3 ? "Create Profile" : (<>Next <ArrowRight className="h-4 w-4" /></>)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
