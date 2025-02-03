import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Reminders = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    notify_before: "1",
    notification_date: "",
    recurrence_type: "None",
    recurrence_interval: ""
  });
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

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
        .order('date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error("Failed to fetch reminders");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.date || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create reminders");
        return;
      }

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
        .insert([newReminder]);

      if (error) throw error;

      toast.success("Reminder created successfully");
      setFormData({
        title: "",
        description: "",
        date: "",
        notify_before: "1",
        notification_date: "",
        recurrence_type: "None",
        recurrence_interval: ""
      });
      fetchReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error("Failed to create reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;
      toast.success("Reminder deleted successfully");
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error("Failed to delete reminder");
    }
  };

  const isActiveReminder = (reminder: any) => {
    const today = new Date();
    const reminderDate = new Date(reminder.date);
    return reminderDate >= today;
  };

  const handleReminderClick = (reminder: any) => {
    setSelectedReminder(reminder);
    setShowReminderDialog(true);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
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
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notify Before (days)</label>
              <Input
                type="number"
                value={formData.notify_before}
                onChange={(e) => handleInputChange('notify_before', e.target.value)}
                required
                min="1"
              />
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
                  <SelectItem value="None">None</SelectItem>
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
                  value={formData.recurrence_interval}
                  onChange={(e) => handleInputChange('recurrence_interval', e.target.value)}
                  min="1"
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Reminder"}
            </Button>
          </div>
        </Card>
      </form>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Reminders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reminders
              .filter(isActiveReminder)
              .map((reminder) => (
                <Card key={reminder.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleReminderClick(reminder)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{reminder.title}</h3>
                      <p className="text-sm text-gray-500">{reminder.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(reminder.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline">{reminder.recurrence_type}</Badge>
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {new Date(reminder.date).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Reminders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reminders
              .filter(reminder => !isActiveReminder(reminder))
              .map((reminder) => (
                <Card key={reminder.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleReminderClick(reminder)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{reminder.title}</h3>
                      <p className="text-sm text-gray-500">{reminder.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline">{reminder.recurrence_type}</Badge>
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {new Date(reminder.date).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reminder Details</DialogTitle>
          </DialogHeader>
          {selectedReminder && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <p className="text-sm">{selectedReminder.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <p className="text-sm">{selectedReminder.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <p className="text-sm">{new Date(selectedReminder.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notify Before</label>
                <p className="text-sm">{selectedReminder.notify_before} days</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Recurrence</label>
                <p className="text-sm">{selectedReminder.recurrence_type}</p>
              </div>
              {selectedReminder.recurrence_type === 'Custom' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Recurrence Interval</label>
                  <p className="text-sm">{selectedReminder.recurrence_interval} days</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;
