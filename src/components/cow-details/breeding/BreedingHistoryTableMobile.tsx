import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BreedingHistoryTableMobileProps {
  breedingRecords: any[];
}

const BreedingHistoryTableMobile = ({ breedingRecords }: BreedingHistoryTableMobileProps) => {
  return (
    <div className="w-full border rounded-lg">
      <ScrollArea className="h-[400px]">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bull Semen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Calving</TableHead>
                <TableHead>Calving Date</TableHead>
                <TableHead>Calf Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breedingRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.insemination_date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.bull_semen || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      record.status === 'Success' ? 'bg-green-100 text-green-800' :
                      record.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.expected_calving_date 
                      ? new Date(record.expected_calving_date).toLocaleDateString() 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.calving_date 
                      ? new Date(record.calving_date).toLocaleDateString() 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.calf_name 
                      ? `${record.calf_name} (${record.calf_gender})` 
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BreedingHistoryTableMobile;