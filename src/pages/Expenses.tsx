import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error("Failed to fetch expenses");
    }
  };

  const handleDelete = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error("Failed to delete expense");
    }
  };

  const openDeleteDialog = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setSelectedExpenseId(null);
    setShowDeleteDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{expense.category}</h3>
                <p className="text-sm text-gray-500">{expense.description}</p>
                <p className="text-sm font-medium mt-2">${expense.amount}</p>
                <p className="text-xs text-gray-500">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => openDeleteDialog(expense.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this expense?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeDeleteDialog}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedExpenseId) {
                    handleDelete(selectedExpenseId);
                    closeDeleteDialog();
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;