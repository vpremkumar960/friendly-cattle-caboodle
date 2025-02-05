import { TableCell, TableRow } from "@/components/ui/table";

interface BreedingTableRowProps {
  record: any;
  onClick?: () => void;
}

const BreedingTableRow = ({ record, onClick }: BreedingTableRowProps) => {
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <TableRow 
      className={onClick ? "cursor-pointer hover:bg-gray-50" : ""}
      onClick={onClick}
    >
      <TableCell>{formatDate(record.insemination_date)}</TableCell>
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
      <TableCell>{formatDate(record.expected_calving_date)}</TableCell>
      <TableCell>{formatDate(record.calving_date)}</TableCell>
      <TableCell>
        {record.calf_name 
          ? `${record.calf_name} (${record.calf_gender})` 
          : 'N/A'}
      </TableCell>
    </TableRow>
  );
};

export default BreedingTableRow;