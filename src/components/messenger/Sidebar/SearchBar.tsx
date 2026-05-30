import { Search } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 px-3 pb-2">
      <InputGroup className="flex-1">
        <InputGroupText>
          <Search data-icon />
        </InputGroupText>
        <InputGroupInput
          placeholder="Tìm kiếm trên Messenger"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-none bg-secondary"
        />
      </InputGroup>
    </div>
  );
}
