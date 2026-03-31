import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-poppins)]">
      <main className="flex flex-col gap-8 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Inventory Management
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px]">
          Efficiently track and manage your stock, orders, and restock queue with our advanced analytics dashboard.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">View Dashboard</Button>
        </div>
      </main>
      
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Inventory Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
