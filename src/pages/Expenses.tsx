import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error("Failed to fetch expenses");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add expenses");
        return;
      }

      const formData = new FormData(e.currentTarget);
      const newExpense = {
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        amount: Number(formData.get("amount")),
        date: formData.get("date") as string,
        user_id: user.id, // Add the user_id here
      };

      const { error } = await supabase
        .from('expenses')
        .insert(newExpense);

      if (error) throw error;

      toast.success("Expense added successfully!");
      fetchExpenses();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error("Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>
      
      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feed">Feed</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
                <SelectItem value="Material">Material</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input name="description" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input type="number" name="amount" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input type="date" name="date" required />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {expenses.map((expense: any) => (
          <Card 
            key={expense.id} 
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedExpense(expense)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{expense.category}</h3>
                <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                <p className="text-sm text-gray-500 mt-2">Date: {expense.date}</p>
              </div>
              <p className="font-semibold">₹{expense.amount}</p>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-medium">Category</label>
              <p>{selectedExpense?.category}</p>
            </div>
            <div>
              <label className="font-medium">Description</label>
              <p>{selectedExpense?.description}</p>
            </div>
            <div>
              <label className="font-medium">Amount</label>
              <p>₹{selectedExpense?.amount}</p>
            </div>
            <div>
              <label className="font-medium">Date</label>
              <p>{selectedExpense?.date}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;