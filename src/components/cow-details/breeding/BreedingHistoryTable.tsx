import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BreedingHistoryTableProps {
  breedingHistory: any[];
}

const BreedingHistoryTable = ({ breedingHistory }: BreedingHistoryTableProps) => {
  return (
    <div className="relative">
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insemination Date</TableHead>
                <TableHead>Bull Semen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Calving</TableHead>
                <TableHead>Calf Gender</TableHead>
                <TableHead>Calf Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breedingHistory.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>{record.insemination_date}</TableCell>
                  <TableCell>{record.bull_semen}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      record.status === 'Success' ? 'bg-green-100 text-green-800' :
                      record.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>{record.expected_calving_date || '-'}</TableCell>
                  <TableCell>{record.calf_gender || '-'}</TableCell>
                  <TableCell>{record.calf_name || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BreedingHistoryTable;