import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addDays, isBefore, isEqual } from "date-fns";

const Reminders = () => {
  const [activeReminders, setActiveReminders] = useState<any[]>([]);
  const [completedReminders, setCompletedReminders] = useState<any[]>([]);

  useEffect(() => {
    fetchReminders();
  }, []);

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

      const completed = data.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return isBefore(reminderDate, today);
      });

      setActiveReminders(active);
      setCompletedReminders(completed);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error("Failed to fetch reminders");
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      const { error } = await supabase
        .from('reminders')
        .insert([{  // Changed to array with single object
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          date,
          notify_before: notifyBefore,
          notification_date: notificationDate
        }]);

      if (error) throw error;

      toast.success("Reminder added successfully!");
      fetchReminders();
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error("Failed to add reminder");
    }
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Reminders</TabsTrigger>
          <TabsTrigger value="completed">Completed Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="p-4">
            <div className="space-y-4">
              {activeReminders.map((reminder) => (
                <Card key={reminder.id} className="p-4">
                  <h3 className="font-semibold">{reminder.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Date: {reminder.date}</p>
                  <p className="text-sm text-gray-500">Notify: {reminder.notify_before.replace('_', ' ')}</p>
                </Card>
              ))}
              {activeReminders.length === 0 && (
                <p className="text-sm text-gray-500">No active reminders</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-4">
            <div className="space-y-4">
              {completedReminders.map((reminder) => (
                <Card key={reminder.id} className="p-4">
                  <h3 className="font-semibold">{reminder.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Date: {reminder.date}</p>
                </Card>
              ))}
              {completedReminders.length === 0 && (
                <p className="text-sm text-gray-500">No completed reminders</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reminders;