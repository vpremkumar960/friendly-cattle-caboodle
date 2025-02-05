import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BreedingTableHeader = () => {
  return (
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
  );
};

export default BreedingTableHeader;