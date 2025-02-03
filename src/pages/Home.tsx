import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, TrendingUp, TrendingDown } from "lucide-react";

const Home = () => {
  const { data: expensesData } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: cowsData } = useQuery({
    queryKey: ['cows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cows')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: breedingData } = useQuery({
    queryKey: ['breeding'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('breeding_records')
        .select('*')
        .order('insemination_date', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const totalCows = cowsData?.length || 0;
  const activeCows = cowsData?.filter(cow => cow.state === 'Active')?.length || 0;
  const totalExpenses = expensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const successfulBreedings = breedingData?.filter(record => record.status === 'Success')?.length || 0;

  const expensesByMonth = expensesData?.reduce((acc: any, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const chartData = Object.entries(expensesByMonth || {}).map(([month, amount]) => ({
    month,
    amount
  }));

  // Calculate month-over-month expense change
  const sortedMonths = Object.keys(expensesByMonth || {}).sort((a, b) => {
    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
  });

  const lastMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];
  const lastMonthExpense = expensesByMonth?.[lastMonth] || 0;
  const previousMonthExpense = expensesByMonth?.[previousMonth] || 0;
  const expenseChange = lastMonthExpense - previousMonthExpense;
  const expenseChangePercentage = previousMonthExpense ? (expenseChange / previousMonthExpense) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Cows</h3>
              <p className="text-2xl font-bold">{totalCows}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{activeCows} active cows</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Monthly Expenses</h3>
              <p className="text-2xl font-bold">₹{lastMonthExpense.toLocaleString()}</p>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${expenseChange >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {expenseChange >= 0 ? (
                <TrendingUp className="h-6 w-6 text-red-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-green-600" />
              )}
            </div>
          </div>
          <p className={`text-sm mt-2 ${expenseChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {expenseChangePercentage.toFixed(1)}% {expenseChange >= 0 ? 'increase' : 'decrease'} from last month
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Lifetime expenses</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Successful Breedings</h3>
              <p className="text-2xl font-bold">{successfulBreedings}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total successful breedings</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Expenses Overview</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                name="Expenses (₹)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Home;