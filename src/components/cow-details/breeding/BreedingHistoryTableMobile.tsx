import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BreedingHistoryTableMobileProps {
  breedingHistory: any[];
}

const BreedingHistoryTableMobile = ({ breedingHistory }: BreedingHistoryTableMobileProps) => {
  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <div className="min-w-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bull</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedingHistory.map((record: any) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.insemination_date)}</TableCell>
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
                <TableCell>{formatDate(record.expected_calving_date)}</TableCell>
                <TableCell>{record.calf_gender || '-'}</TableCell>
                <TableCell>{record.calf_name || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default BreedingHistoryTableMobile;