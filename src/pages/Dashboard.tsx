import { Card } from "@/components/ui/card";
import { LineChart, Beef, Droplets } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Dashboard = () => {
  const stats = [
    { 
      label: "Cow Statistics", 
      value: "156 Total", 
      icon: Beef, 
      details: [
        "123 Total Cows",
        "45 Pregnant & Milking (30%)"
      ]
    },
    { label: "Today's Milk", value: "1,250L", icon: LineChart, change: "+3% from yesterday" },
  ];

  // Combine regular todos with reminders
  const todos = [
    { id: "sunday-bath", label: "Sunday Cow Bathing", date: "Every Sunday", type: "regular" },
    { id: "deworming", label: "Deworming", date: "Every 3 months", type: "regular" },
    { id: "vaccination", label: "Vaccination", date: "Tomorrow", type: "regular" },
    { id: "lakshmi-birthday", label: "Lakshmi's Birthday", date: "2024-02-15", type: "birthday" },
    // Add reminders from the Reminders component state here
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your farm's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.details && (
                  <div className="mt-2 space-y-1">
                    {stat.details.map((detail, index) => (
                      <p key={index} className="text-sm text-gray-500">{detail}</p>
                    ))}
                  </div>
                )}
                {stat.change && <p className="text-sm text-gray-500 mt-2">{stat.change}</p>}
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
              {todo.type === "birthday" && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Birthday</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;