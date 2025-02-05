import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody } from "@/components/ui/table";
import BreedingTableHeader from "./BreedingTableHeader";
import BreedingTableRow from "./BreedingTableRow";

interface BreedingHistoryTableMobileProps {
  breedingRecords: any[];
}

const BreedingHistoryTableMobile = ({ breedingRecords }: BreedingHistoryTableMobileProps) => {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <ScrollArea className="h-[400px]">
        <div className="min-w-[600px] p-1">
          <Table>
            <BreedingTableHeader />
            <TableBody>
              {breedingRecords.map((record) => (
                <BreedingTableRow key={record.id} record={record} />
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BreedingHistoryTableMobile;