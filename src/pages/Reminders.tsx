import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Reminders = () => {
  const [reminders, setReminders] = useState([
    { 
      id: 1, 
      title: "Vaccination", 
      description: "Annual vaccination for all cows", 
      date: "2024-02-01",
      notifyBefore: "1_week"
    },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReminder = {
      id: reminders.length + 1,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      notifyBefore: formData.get("notifyBefore") as string,
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reminders;