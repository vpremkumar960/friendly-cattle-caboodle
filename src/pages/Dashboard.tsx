import { Card } from "@/components/ui/card";
import { LineChart, Beef, Droplets, Stethoscope } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Dashboard = () => {
  const stats = [
    { label: "Total Cows", value: "156", icon: Beef, change: "+12% from last month" },
    { label: "Pregnant Cows", value: "45", icon: Stethoscope, change: "30% of total" },
    { label: "Milking Cows", value: "78", icon: Droplets, change: "50% of total" },
    { label: "Today's Milk", value: "1,250L", icon: LineChart, change: "+3% from yesterday" },
  ];

  const todos = [
    { id: "sunday-bath", label: "Sunday Cow Bathing", date: "Every Sunday" },
    { id: "deworming", label: "Deworming", date: "Every 3 months" },
    { id: "vaccination", label: "Vaccination", date: "Tomorrow" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your farm's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
              </div>
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold mb-4">Todo List</h2>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center space-x-4">
              <Checkbox id={todo.id} />
              <div className="flex-1">
                <label htmlFor={todo.id} className="text-sm font-medium cursor-pointer">
                  {todo.label}
                </label>
                <p className="text-sm text-gray-500">{todo.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;