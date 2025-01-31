import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface BreedingTableProps {
  breedingRecords: any[];
  onRecordClick: (record: any) => void;
}

const BreedingTable = ({ breedingRecords, onRecordClick }: BreedingTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cow Name</TableHead>
            <TableHead>Insemination Date</TableHead>
            <TableHead>Bull Semen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expected Calving</TableHead>
            <TableHead>Calving Date</TableHead>
            <TableHead>Calf Gender</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breedingRecords.map((record: any) => (
            <TableRow 
              key={record.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onRecordClick(record)}
            >
              <TableCell>{record.cows?.name}</TableCell>
              <TableCell>{record.insemination_date}</TableCell>
              <TableCell>{record.bull_semen}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.expected_calving_date || '-'}</TableCell>
              <TableCell>{record.calving_date || '-'}</TableCell>
              <TableCell>{record.calf_gender || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BreedingTable;