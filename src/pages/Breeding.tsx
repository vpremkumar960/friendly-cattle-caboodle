import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Breeding = () => {
  const breedingRecords = [
    { cowId: "001", date: "2024-01-15", type: "AI", status: "Successful", nextCheckup: "2024-02-15" },
    { cowId: "002", date: "2024-01-20", type: "Natural", status: "Pending", nextCheckup: "2024-02-20" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Breeding Records</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cow ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Checkup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedingRecords.map((record) => (
              <TableRow key={record.cowId + record.date}>
                <TableCell>{record.cowId}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.nextCheckup}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Breeding;