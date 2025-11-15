import { useState } from "react";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface DatePickerProps {
  initialDate?: Date;
  labelDate?: string;
  onDateChange: (date: string) => void;
}

export function DatePicker({ initialDate, onDateChange, labelDate }: DatePickerProps){
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(initialDate);

  return (
    <div>
      <Label>{labelDate ?? 'Date'}</Label>

      <div className="mt-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              id="date"
              className="w-48 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDown />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              onSelect={(date) => {
                const dateResponse = date ?? new Date();
                setDate(dateResponse)
                onDateChange(dateResponse.toISOString())
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
