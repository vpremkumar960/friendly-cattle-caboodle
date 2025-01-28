import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const Records = () => {
  const records = [
    { id: "001", state: "Milking", production: "25L/day", health: "Good", lastCheckup: "2024-01-15" },
    { id: "002", state: "Pregnant", production: "20L/day", health: "Good", lastCheckup: "2024-01-20" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <Input className="max-w-xs" placeholder="Search records..." />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cow ID</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Production</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Last Checkup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.state}</TableCell>
                <TableCell>{record.production}</TableCell>
                <TableCell>{record.health}</TableCell>
                <TableCell>{record.lastCheckup}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Records;