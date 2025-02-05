import { TableBody } from "@/components/ui/table";
import BreedingTableRow from "./BreedingTableRow";

interface BreedingTableBodyProps {
  records: any[];
  onRecordClick?: (record: any) => void;
}

const BreedingTableBody = ({ records, onRecordClick }: BreedingTableBodyProps) => {
  return (
    <TableBody>
      {records.map((record) => (
        <BreedingTableRow 
          key={record.id} 
          record={record}
          onClick={onRecordClick ? () => onRecordClick(record) : undefined}
        />
      ))}
    </TableBody>
  );
};

export default BreedingTableBody;