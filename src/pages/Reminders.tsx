import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    notify_before: '1 day',
    notification_date: '',
    recurrence_type: 'None',
    recurrence_interval: ''
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate notification date when date or notify_before changes
    if (field === 'date' || field === 'notify_before') {
      const reminderDate = new Date(value || formData.date);
      if (reminderDate && !isNaN(reminderDate.getTime())) {
        const days = parseInt(field === 'notify_before' ? value : formData.notify_before);
        const notificationDate = new Date(reminderDate);
        notificationDate.setDate(notificationDate.getDate() - days);
        setFormData(prev => ({
          ...prev,
          notification_date: notificationDate.toISOString().split('T')[0]
        }));
      }
    }
  };

  const fetchReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error("Failed to fetch reminders");
    }
  };

  const validateForm = () => {
    if (!formData.date) {
      toast.error("Please select a reminder date");
      return false;
    }
    if (!formData.title) {
      toast.error("Please enter a title");
      return false;
    }
    if (formData.recurrence_type === 'Custom' && !formData.recurrence_interval) {
      toast.error("Please enter a recurrence interval");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add reminders");
        return;
      }

      // Format dates properly
      const reminderDate = new Date(formData.date);
      const notificationDate = new Date(formData.notification_date);

      const newReminder = {
        title: formData.title,
        description: formData.description,
        date: reminderDate.toISOString().split('T')[0],
        notify_before: formData.notify_before,
        notification_date: notificationDate.toISOString().split('T')[0],
        user_id: user.id,
        recurrence_type: formData.recurrence_type,
        recurrence_interval: formData.recurrence_type === 'Custom' ? parseInt(formData.recurrence_interval) : null
      };

      const { error } = await supabase
        .from('reminders')
        .insert(newReminder);

      if (error) throw error;

      toast.success("Reminder added successfully!");
      fetchReminders();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        notify_before: '1 day',
        notification_date: '',
        recurrence_type: 'None',
        recurrence_interval: ''
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error("Failed to add reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reminders</h1>
      
      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notify Before</label>
            <Select
              value={formData.notify_before}
              onValueChange={(value) => handleInputChange('notify_before', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notification time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 day">1 Day Before</SelectItem>
                <SelectItem value="2 days">2 Days Before</SelectItem>
                <SelectItem value="3 days">3 Days Before</SelectItem>
                <SelectItem value="1 week">1 Week Before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recurrence</label>
            <Select
              value={formData.recurrence_type}
              onValueChange={(value) => handleInputChange('recurrence_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None (One-time)</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.recurrence_type === 'Custom' && (
            <div>
              <label className="block text-sm font-medium mb-1">Recurrence Interval (days)</label>
              <Input
                type="number"
                min="1"
                value={formData.recurrence_interval}
                onChange={(e) => handleInputChange('recurrence_interval', e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Reminder"}
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {reminders.map((reminder: any) => (
          <Card 
            key={reminder.id} 
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedReminder(reminder)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{reminder.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {reminder.date} | Notify: {reminder.notify_before} before
                </p>
                {reminder.recurrence_type !== 'None' && (
                  <p className="text-sm text-gray-500">
                    Recurrence: {reminder.recurrence_type}
                    {reminder.recurrence_type === 'Custom' && ` (${reminder.recurrence_interval} days)`}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedReminder} onOpenChange={() => setSelectedReminder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reminder Details</DialogTitle>
            <DialogDescription>View the details of your reminder.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-medium">Title</label>
              <p>{selectedReminder?.title}</p>
            </div>
            <div>
              <label className="font-medium">Description</label>
              <p>{selectedReminder?.description}</p>
            </div>
            <div>
              <label className="font-medium">Date</label>
              <p>{selectedReminder?.date}</p>
            </div>
            <div>
              <label className="font-medium">Notify Before</label>
              <p>{selectedReminder?.notify_before}</p>
            </div>
            <div>
              <label className="font-medium">Recurrence</label>
              <p>
                {selectedReminder?.recurrence_type}
                {selectedReminder?.recurrence_type === 'Custom' && 
                  ` (${selectedReminder?.recurrence_interval} days)`
                }
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;