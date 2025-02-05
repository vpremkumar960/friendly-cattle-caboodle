import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "@/components/ui/table";
import BreedingTableHeader from "./BreedingTableHeader";
import BreedingTableBody from "./BreedingTableBody";

interface BreedingHistoryTableProps {
  breedingRecords: any[];
  onRecordClick?: (record: any) => void;
}

const BreedingHistoryTable = ({ breedingRecords, onRecordClick }: BreedingHistoryTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <ScrollArea className="h-[400px]">
        <div className="min-w-[600px] p-1">
          <Table>
            <BreedingTableHeader />
            <BreedingTableBody 
              records={breedingRecords}
              onRecordClick={onRecordClick}
            />
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BreedingHistoryTable;