import { Card } from "@/components/ui/card";
import { LineChart, Beef, Droplets, Stethoscope } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Total Cows", value: "156", icon: Beef, change: "+12% from last month" },
    { label: "Avg. Production", value: "28.5L", icon: Droplets, change: "+5% from last month" },
    { label: "Health Checks", value: "23", icon: Stethoscope, change: "Due this week" },
    { label: "Milk Production", value: "4,250L", icon: LineChart, change: "+3% from yesterday" },
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-gray-600">Cow #1234 completed health check</p>
                <span className="ml-auto text-gray-400">2h ago</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <p className="text-gray-600">Vaccination due for Cow #5678</p>
                <span className="ml-auto text-gray-400">Tomorrow</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;