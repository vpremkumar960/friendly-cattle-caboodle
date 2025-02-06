
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BreedingRecordCardProps {
  record: any;
  onClick: () => void;
  onDelete: (id: string) => void;
  isComplete: boolean;
}

const BreedingRecordCard = ({ record, onClick, onDelete, isComplete }: BreedingRecordCardProps) => {
  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className={`p-4 transition-shadow ${!isComplete ? 'hover:shadow-lg cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-medium">{record.cows?.name}</h3>
              <p className="text-sm text-gray-500">Bull Semen: {record.bull_semen}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${
              record.status === 'Success' ? 'bg-green-100 text-green-800' :
              record.status === 'Failed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {record.status}
            </Badge>
            {!isComplete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Insemination Date</p>
            <p className="text-sm text-gray-500">{formatDate(record.insemination_date)}</p>
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
        
        {isComplete && (
          <div className="mt-2 text-sm text-gray-500 italic">
            This record is complete and cannot be modified.
          </div>
        )}
      </div>
    </Card>
  );
};

export default BreedingRecordCard;
