import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User2 } from "lucide-react";

interface BreedingTableProps {
  breedingRecords: any[];
  onRecordClick: (record: any) => void;
}

const BreedingTable = ({ breedingRecords, onRecordClick }: BreedingTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {breedingRecords.map((record: any) => (
        <Card 
          key={record.id}
          className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onRecordClick(record)}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User2 className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium">{record.cows?.name}</h3>
                  <p className="text-sm text-gray-500">Bull Semen: {record.bull_semen}</p>
                </div>
              </div>
              <Badge className={getStatusColor(record.status)}>
                {record.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Insemination Date</p>
                  <p className="text-sm text-gray-500">{formatDate(record.insemination_date)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Expected Calving</p>
                <p className="text-sm text-gray-500">{formatDate(record.expected_calving_date)}</p>
              </div>
              
              {record.status === 'Success' && (
                <div>
                  <p className="text-sm font-medium">Calf Details</p>
                  <p className="text-sm text-gray-500">
                    {record.calf_name} ({record.calf_gender || 'Unknown'})
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BreedingTable;