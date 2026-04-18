import BottomNav from "@/components/BottomNav";

const History = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto max-w-md px-4 py-5">
          <h1 className="text-xl font-semibold text-foreground">History</h1>
          <p className="text-xs text-muted-foreground">Past posture sessions</p>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-8">
        <p className="text-sm text-muted-foreground">History data will appear here</p>
      </main>
      <BottomNav />
    </div>
  );
};

export default History;
