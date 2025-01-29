import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import AddCow from "./pages/AddCow";
import Records from "./pages/Records";
import Production from "./pages/Production";
import Breeding from "./pages/Breeding";
import Reminders from "./pages/Reminders";
import Expenses from "./pages/Expenses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-cow" element={<AddCow />} />
              <Route path="/records" element={<Records />} />
              <Route path="/production" element={<Production />} />
              <Route path="/breeding" element={<Breeding />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;