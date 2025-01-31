import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Beef, Droplets } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, isBefore, isEqual } from "date-fns";

const Dashboard = () => {
  const [cows, setCows] = useState<any[]>([]);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    fetchCows();
    fetchReminders();
  }, []);

  const fetchCows = async () => {
    try {
      const { data, error } = await supabase
        .from('cows')
        .select('*');
      
      if (error) throw error;
      setCows(data || []);
    } catch (error) {
      console.error('Error fetching cows:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      // Filter reminders for the next 7 days
      const today = new Date();
      const filteredReminders = data.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        const diffTime = reminderDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      });

      setReminders(filteredReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const calculateStats = () => {
    const totalCows = cows.length;
    const maleCows = cows.filter(cow => cow.gender === 'male').length;
    const femaleCows = cows.filter(cow => cow.gender === 'female').length;
    const pregnantCows = cows.filter(cow => cow.state === 'milking-pregnant').length;
    const milkingCows = cows.filter(cow => cow.state === 'milking').length;
    const dryCows = cows.filter(cow => cow.state === 'dry').length;
    const calves = cows.filter(cow => cow.state === 'calf').length;

    return {
      total: totalCows,
      males: maleCows,
      females: femaleCows,
      pregnant: pregnantCows,
      milking: milkingCows,
      dry: dryCows,
      calves: calves
    };
  };

  const stats = [
    { 
      label: "Cow Statistics", 
      value: `${cows.length} Total`, 
      icon: Beef,
      details: [
        `${cows.filter(cow => cow.gender === 'female').length} Female Cows`,
        `${cows.filter(cow => cow.gender === 'male').length} Male Cows`,
        `${cows.filter(cow => cow.state === 'milking-pregnant').length} Pregnant & Milking`
      ]
    },
    { 
      label: "Today's Milk", 
      value: "1,250L", 
      icon: LineChart, 
      change: "+3% from yesterday" 
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your farm's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => stat.label === "Cow Statistics" && setShowStatsDialog(true)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.details && (
                  <div className="mt-2 space-y-1">
                    {stat.details.map((detail, index) => (
                      <p key={index} className="text-sm text-gray-500">{detail}</p>
                    ))}
                  </div>
                )}
                {stat.change && <p className="text-sm text-gray-500 mt-2">{stat.change}</p>}
              </div>
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center space-x-4">
              <Checkbox id={reminder.id.toString()} />
              <div className="flex-1">
                <label htmlFor={reminder.id.toString()} className="text-sm font-medium cursor-pointer">
                  {reminder.title}
                </label>
                <p className="text-sm text-gray-500">
                  {format(new Date(reminder.date), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-500">{reminder.description}</p>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-sm text-gray-500">No upcoming events</p>
          )}
        </div>
      </Card>

      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detailed Cow Statistics</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Total Cows: {calculateStats().total}</p>
            <p>Male Bulls: {calculateStats().males}</p>
            <p>Female Cows: {calculateStats().females}</p>
            <p>Pregnant Cows: {calculateStats().pregnant}</p>
            <p>Milking Cows: {calculateStats().milking}</p>
            <p>Dry Cows: {calculateStats().dry}</p>
            <p>Calves: {calculateStats().calves}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;