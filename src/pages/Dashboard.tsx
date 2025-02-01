import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Beef, Droplets } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, isBefore, isEqual, differenceInDays } from "date-fns";

const Dashboard = () => {
  const [cows, setCows] = useState<any[]>([]);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [activeReminders, setActiveReminders] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchCows();
    fetchReminders();
  }, []);

  useEffect(() => {
    if (cows.length > 0) {
      checkDewormingDates();
    }
  }, [cows]);

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

  const checkDewormingDates = () => {
    const today = new Date();
    const events: any[] = [];

    cows.forEach(cow => {
      if (cow.last_deworming_date) {
        const lastDeworming = new Date(cow.last_deworming_date);
        const nextDeworming = addDays(lastDeworming, 90); // 3 months
        const daysUntilNext = differenceInDays(nextDeworming, today);

        if (daysUntilNext <= 10 && daysUntilNext > 0) {
          events.push({
            title: `Deworming due for ${cow.name}`,
            description: `Due in ${daysUntilNext} days`,
            date: format(nextDeworming, 'yyyy-MM-dd'),
            type: 'deworming'
          });
        }
      }
    });

    setUpcomingEvents(prev => [...prev, ...events]);
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const active = data.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return !isBefore(reminderDate, today);
      });

      const upcoming = active.filter(reminder => {
        const notificationDate = new Date(reminder.notification_date);
        notificationDate.setHours(0, 0, 0, 0);
        const reminderDate = new Date(reminder.date);
        return !isBefore(notificationDate, today) && !isEqual(reminderDate, today);
      });

      setActiveReminders(active);
      setUpcomingEvents(prev => [...prev, ...upcoming]);
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
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Checkbox id={`event-${index}`} />
              <div className="flex-1">
                <label htmlFor={`event-${index}`} className="text-sm font-medium cursor-pointer">
                  {event.title}
                </label>
                <p className="text-sm text-gray-500">
                  {format(new Date(event.date), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
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