import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Reminders = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
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

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Reminder"}
        </Button>
      </form>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Reminders</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders
                .filter(isActiveReminder)
                .map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell>{reminder.title}</TableCell>
                    <TableCell>{reminder.description}</TableCell>
                    <TableCell>{new Date(reminder.date).toLocaleDateString()}</TableCell>
                    <TableCell>{reminder.recurrence_type}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Reminders</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders
                .filter(reminder => !isActiveReminder(reminder))
                .map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell>{reminder.title}</TableCell>
                    <TableCell>{reminder.description}</TableCell>
                    <TableCell>{new Date(reminder.date).toLocaleDateString()}</TableCell>
                    <TableCell>{reminder.recurrence_type}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
              <label className="font-medium">Notification Date</label>
              <p>{selectedReminder?.notification_date}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;