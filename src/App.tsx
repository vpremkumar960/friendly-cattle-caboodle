import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import AddCow from "@/pages/AddCow";
import Records from "@/pages/Records";
import Production from "@/pages/Production";
import Breeding from "@/pages/Breeding";
import Reminders from "@/pages/Reminders";
import Expenses from "@/pages/Expenses";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {session ? (
          <div className="flex flex-col md:flex-row">
            <Navigation />
            <main className="flex-1 p-4 md:p-6">
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
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
        <Toaster />
      </div>
    </Router>
  );
};

export default App;