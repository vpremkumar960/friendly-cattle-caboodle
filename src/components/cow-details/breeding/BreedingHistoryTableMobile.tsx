
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "@/components/ui/table";
import BreedingTableHeader from "./BreedingTableHeader";
import BreedingTableBody from "./BreedingTableBody";

interface BreedingHistoryTableMobileProps {
  breedingRecords: any[];
  onRecordClick?: (record: any) => void;
}

const BreedingHistoryTableMobile = ({ 
  breedingRecords,
  onRecordClick 
}: BreedingHistoryTableMobileProps) => {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <ScrollArea className="h-[400px] w-full">
        <div className="min-w-[600px] w-full p-1">
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

export default BreedingHistoryTableMobile;
