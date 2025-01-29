import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addDays, isBefore, isEqual } from "date-fns";

const Reminders = () => {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        title: "Vaccination", 
        description: "Annual vaccination for all cows", 
        date: "2024-02-01",
        notifyBefore: "1_day",
        notificationDate: "2024-01-31"
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const checkReminders = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      reminders.forEach(reminder => {
        const notificationDate = new Date(reminder.notificationDate);
        notificationDate.setHours(0, 0, 0, 0);

        if (isEqual(today, notificationDate)) {
          toast.info(`Reminder: ${reminder.title} is due ${reminder.notifyBefore === "1_day" ? "tomorrow" : "soon"}!`);
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(interval);
  }, [reminders]);

  const calculateNotificationDate = (date: string, notifyBefore: string) => {
    const eventDate = new Date(date);
    switch (notifyBefore) {
      case "1_day":
        return addDays(eventDate, -1).toISOString().split('T')[0];
      case "4_days":
        return addDays(eventDate, -4).toISOString().split('T')[0];
      case "1_week":
        return addDays(eventDate, -7).toISOString().split('T')[0];
      case "2_weeks":
        return addDays(eventDate, -14).toISOString().split('T')[0];
      default:
        return addDays(eventDate, -1).toISOString().split('T')[0];
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const notifyBefore = formData.get("notifyBefore") as string;
    
    const notificationDate = calculateNotificationDate(date, notifyBefore);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const notifyDate = new Date(notificationDate);
    if (isBefore(notifyDate, today)) {
      toast.error("Notification date cannot be in the past!");
      return;
    }

    const newReminder = {
      id: reminders.length + 1,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date,
      notifyBefore,
      notificationDate
    };
    
    setReminders([...reminders, newReminder]);
    toast.success("Reminder added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reminders</h1>
      
      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input name="title" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input type="date" name="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notify Before</label>
            <Select name="notifyBefore" required>
              <SelectTrigger>
                <SelectValue placeholder="Select notification time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_day">1 Day Before</SelectItem>
                <SelectItem value="4_days">4 Days Before</SelectItem>
                <SelectItem value="1_week">1 Week Before</SelectItem>
                <SelectItem value="2_weeks">2 Weeks Before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Reminder</Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="p-4">
            <h3 className="font-semibold">{reminder.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
            <p className="text-sm text-gray-500 mt-2">Date: {reminder.date}</p>
            <p className="text-sm text-gray-500">Notify: {reminder.notifyBefore.replace('_', ' ')}</p>
            <p className="text-sm text-gray-500">Notification Date: {reminder.notificationDate}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reminders;