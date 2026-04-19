import jsPDF from "jspdf";

/* ────── types ────── */

export interface ReportData {
  reportType: "Weekly" | "Monthly";
  userName: string;
  userAge: string;
  userHeight: string;
  userWeight: string;
  userScreenTime: string;
  userBmi: string;
  avgAngle: number;
  healthScore: number;
  neckRisk: number;
  activeWearTime: number;
  postureImprovement: number;
  recoveryTime: number;
  trendData: { time: string; angle: number }[];
}

/* ────── colors ────── */

const TEAL = [0, 150, 136] as const;       // primary teal
const TEAL_LIGHT = [224, 242, 241] as const; // light teal bg
const DARK = [33, 33, 33] as const;
const GRAY = [117, 117, 117] as const;
const WHITE = [255, 255, 255] as const;
const BORDER = [200, 200, 200] as const;

/* ────── helpers ────── */

function rgb(c: readonly [number, number, number]) {
  return { r: c[0], g: c[1], b: c[2] };
}

function generateInsight(d: ReportData): { summary: string; recommendations: string[] } {
  const status =
    d.avgAngle < 20 ? "good" : d.avgAngle <= 30 ? "moderate" : "poor";

  const summaryMap = {
    good: `Your average neck angle of ${d.avgAngle}° indicates excellent posture habits. Your health score of ${d.healthScore}/100 reflects consistent discipline. Keep maintaining your current routine.`,
    moderate: `Your average neck angle of ${d.avgAngle}° shows room for improvement. With a health score of ${d.healthScore}/100 and ${d.neckRisk}% time in risk posture, targeted adjustments can make a significant difference.`,
    poor: `Your average neck angle of ${d.avgAngle}° indicates frequent poor posture. With a health score of ${d.healthScore}/100 and ${d.neckRisk}% time above safe thresholds, immediate corrective action is recommended.`,
  };

  const recs: string[] = [];

  if (d.avgAngle > 25)
    recs.push("Position your screen at eye level to reduce forward head tilt.");
  if (d.neckRisk > 30)
    recs.push("Take a 2-minute posture break every 30 minutes during screen time.");
  if (d.activeWearTime < 3)
    recs.push("Increase daily device wear time to at least 4 hours for better tracking.");
  if (d.recoveryTime > 5)
    recs.push("Practice chin-tuck exercises to improve recovery speed.");
  if (d.postureImprovement < 0)
    recs.push("Your posture has worsened recently. Consider re-evaluating your workspace ergonomics.");

  // Always have at least 2 recommendations
  if (recs.length === 0) {
    recs.push("Continue your current posture practices — they are effective.");
    recs.push("Consider adding neck stretches to your daily routine for prevention.");
  }
  if (recs.length === 1) {
    recs.push("Stay consistent with your CerviSense device for ongoing monitoring.");
  }

  return { summary: summaryMap[status], recommendations: recs };
}

/* ────── main export ────── */

export function generatePostureReport(data: ReportData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pw - margin * 2;
  let y = 0;

  /* ── helper: section title ── */
  const sectionTitle = (title: string, yPos: number) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const { r, g, b } = rgb(TEAL);
    doc.setTextColor(r, g, b);
    doc.text(title.toUpperCase(), margin, yPos);
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 1.5, margin + contentW, yPos + 1.5);
    return yPos + 8;
  };

  /* ── helper: metric box ── */
  const metricBox = (
    x: number,
    yPos: number,
    w: number,
    label: string,
    value: string
  ) => {
    // box bg
    const { r: lr, g: lg, b: lb } = rgb(TEAL_LIGHT);
    doc.setFillColor(lr, lg, lb);
    doc.roundedRect(x, yPos, w, 22, 2, 2, "F");

    // label
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    const { r: gr, g: gg, b: gb } = rgb(GRAY);
    doc.setTextColor(gr, gg, gb);
    doc.text(label, x + w / 2, yPos + 7, { align: "center" });

    // value
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const { r: tr, g: tg, b: tb } = rgb(TEAL);
    doc.setTextColor(tr, tg, tb);
    doc.text(value, x + w / 2, yPos + 17, { align: "center" });
  };

  /* ── helper: page check ── */
  const ensureSpace = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      y = 20;
    }
  };

  /* ========================================
   * 1. HEADER
   * ======================================== */

  // Teal header band
  const { r: hr, g: hg, b: hb } = rgb(TEAL);
  doc.setFillColor(hr, hg, hb);
  doc.rect(0, 0, pw, 42, "F");

  // Logo circle
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 8, 14, 7, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(hr, hg, hb);
  doc.text("CS", margin + 8, 16, { align: "center" });

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const { r: wr, g: wg, b: wb } = rgb(WHITE);
  doc.setTextColor(wr, wg, wb);
  doc.text("Posture Health Report", margin + 20, 16);

  // Subtitle line
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 240, 238);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(
    `${data.userName}  •  ${data.reportType} Report  •  ${dateStr}`,
    margin + 20,
    23
  );

  // Divider accent
  doc.setFillColor(wr, wg, wb);
  doc.rect(margin, 32, contentW, 0.5, "F");

  // CerviSense tagline
  doc.setFontSize(7);
  doc.setTextColor(200, 230, 228);
  doc.text("Track. Analyze. Align.", margin, 38);

  y = 50;

  /* ========================================
   * 2. USER SUMMARY
   * ======================================== */

  y = sectionTitle("Patient Summary", y);

  const summaryFields = [
    ["Age", data.userAge],
    ["Height", data.userHeight],
    ["Weight", data.userWeight],
    ["Screen Time", data.userScreenTime],
    ["BMI", data.userBmi],
  ];

  doc.setFontSize(9);
  const colW = contentW / 5;
  summaryFields.forEach(([label, value], i) => {
    const x = margin + i * colW;
    // label
    doc.setFont("helvetica", "normal");
    const { r: gr2, g: gg2, b: gb2 } = rgb(GRAY);
    doc.setTextColor(gr2, gg2, gb2);
    doc.text(label, x + colW / 2, y, { align: "center" });
    // value
    doc.setFont("helvetica", "bold");
    const { r: dr, g: dg, b: db } = rgb(DARK);
    doc.setTextColor(dr, dg, db);
    doc.text(value, x + colW / 2, y + 5.5, { align: "center" });
  });

  y += 14;

  // subtle divider
  const { r: br, g: bg2, b: bb } = rgb(BORDER);
  doc.setDrawColor(br, bg2, bb);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentW, y);
  y += 8;

  /* ========================================
   * 3. KEY METRICS
   * ======================================== */

  y = sectionTitle("Key Metrics", y);

  const boxW = (contentW - 8) / 3;
  const gap = 4;

  // Row 1: 3 metrics
  metricBox(margin, y, boxW, "AVG ANGLE", `${data.avgAngle}°`);
  metricBox(margin + boxW + gap, y, boxW, "HEALTH SCORE", `${data.healthScore}/100`);
  metricBox(margin + (boxW + gap) * 2, y, boxW, "NECK RISK", `${data.neckRisk}%`);
  y += 28;

  // Row 2: 2 metrics (centered)
  const row2W = (contentW - 4) / 2;
  metricBox(margin, y, row2W, "ACTIVE WEAR TIME", `${data.activeWearTime} hrs`);
  metricBox(margin + row2W + gap, y, row2W, "POSTURE IMPROVEMENT", `${data.postureImprovement > 0 ? "+" : ""}${data.postureImprovement}%`);
  y += 30;

  /* ========================================
   * 4. POSTURE TREND CHART
   * ======================================== */

  ensureSpace(65);
  y = sectionTitle("Posture Trend", y);

  // Chart area
  const chartX = margin + 8;
  const chartW = contentW - 16;
  const chartH = 45;
  const chartY = y;

  // Background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, chartY - 3, contentW, chartH + 10, 2, 2, "F");

  // Draw grid lines
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  for (let i = 0; i <= 4; i++) {
    const gy = chartY + chartH - (i / 4) * chartH;
    doc.line(chartX, gy, chartX + chartW, gy);
  }

  // Plot data
  if (data.trendData.length > 1) {
    const angles = data.trendData.map((d) => d.angle);
    const maxAngle = Math.max(...angles, 40);
    const minAngle = Math.min(...angles, 0);
    const range = maxAngle - minAngle || 1;
    const step = chartW / (data.trendData.length - 1);

    // Y-axis labels
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    const { r: gr3, g: gg3, b: gb3 } = rgb(GRAY);
    doc.setTextColor(gr3, gg3, gb3);
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(minAngle + (i / 4) * range);
      const gy = chartY + chartH - (i / 4) * chartH;
      doc.text(`${val}°`, margin + 2, gy + 1);
    }

    // Line chart
    doc.setDrawColor(hr, hg, hb);
    doc.setLineWidth(0.8);

    for (let i = 0; i < data.trendData.length - 1; i++) {
      const x1 = chartX + i * step;
      const x2 = chartX + (i + 1) * step;
      const y1 =
        chartY + chartH - ((angles[i] - minAngle) / range) * chartH;
      const y2 =
        chartY + chartH - ((angles[i + 1] - minAngle) / range) * chartH;
      doc.line(x1, y1, x2, y2);
    }

    // Dots
    doc.setFillColor(hr, hg, hb);
    data.trendData.forEach((d, i) => {
      const x = chartX + i * step;
      const py =
        chartY + chartH - ((d.angle - minAngle) / range) * chartH;
      doc.circle(x, py, 1.2, "F");
    });

    // X-axis labels (every few)
    doc.setFontSize(5.5);
    doc.setTextColor(gr3, gg3, gb3);
    const labelStep = Math.max(1, Math.floor(data.trendData.length / 8));
    data.trendData.forEach((d, i) => {
      if (i % labelStep === 0 || i === data.trendData.length - 1) {
        const x = chartX + i * step;
        doc.text(d.time, x, chartY + chartH + 4, { align: "center" });
      }
    });
  }

  y = chartY + chartH + 12;

  /* ========================================
   * 5. AI INSIGHT
   * ======================================== */

  ensureSpace(55);
  y = sectionTitle("AI-Generated Insight", y);

  const insight = generateInsight(data);

  // Summary box
  const { r: lr2, g: lg2, b: lb2 } = rgb(TEAL_LIGHT);
  doc.setFillColor(lr2, lg2, lb2);
  const summaryLines = doc.splitTextToSize(insight.summary, contentW - 12);
  const summaryH = summaryLines.length * 4.5 + 8;
  doc.roundedRect(margin, y, contentW, summaryH, 2, 2, "F");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const { r: dr2, g: dg2, b: db2 } = rgb(DARK);
  doc.setTextColor(dr2, dg2, db2);
  doc.text(summaryLines, margin + 6, y + 6);
  y += summaryH + 6;

  // Recommendations
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(dr2, dg2, db2);
  doc.text("Recommendations:", margin, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  insight.recommendations.forEach((rec) => {
    ensureSpace(8);
    // bullet
    doc.setFillColor(hr, hg, hb);
    doc.circle(margin + 3, y - 1, 1, "F");
    // text
    const recLines = doc.splitTextToSize(rec, contentW - 12);
    doc.setTextColor(dr2, dg2, db2);
    doc.text(recLines, margin + 7, y);
    y += recLines.length * 4 + 3;
  });

  y += 5;

  /* ========================================
   * 6. FOOTER
   * ======================================== */

  ensureSpace(20);
  doc.setDrawColor(br, bg2, bb);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const { r: gr4, g: gg4, b: gb4 } = rgb(GRAY);
  doc.setTextColor(gr4, gg4, gb4);
  doc.text(
    "Generated by CerviSense • This report is for informational purposes only and does not constitute medical advice.",
    pw / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text(
    `Report ID: CS-${Date.now().toString(36).toUpperCase()} • ${dateStr}`,
    pw / 2,
    y,
    { align: "center" }
  );

  /* ── save ── */
  const filename = `CerviSense_${data.reportType}_Report_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  doc.save(filename);
}
