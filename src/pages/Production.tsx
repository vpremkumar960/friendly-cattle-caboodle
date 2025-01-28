import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Production = () => {
  const data = [
    { name: 'Jan', milk: 4000 },
    { name: 'Feb', milk: 3000 },
    { name: 'Mar', milk: 2000 },
    { name: 'Apr', milk: 2780 },
    { name: 'May', milk: 1890 },
    { name: 'Jun', milk: 2390 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Milk Production</h1>
      <Card className="p-6">
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="milk" stroke="#8884d8" />
        </LineChart>
      </Card>
    </div>
  );
};

export default Production;