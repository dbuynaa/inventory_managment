'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import SalesCreateModal from './sales-create-modal';
import { OrderStatus } from '@prisma/client';
import { type DateRange } from 'react-day-picker';

export const SalesHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: null, to: null });

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(
      range
        ? { from: range.from ?? null, to: range.to ?? null }
        : { from: null, to: null }
    );
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row">
      <Input
        placeholder="Харилцагчийн нэрээр хайх..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:w-1/3"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="md:w-1/4">
          <SelectValue placeholder="Статусаар шүүх" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(OrderStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="md:w-1/4">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Огноо сонгох</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from ?? new Date()}
            selected={{
              from: dateRange.from ?? undefined,
              to: dateRange.to ?? undefined
            }}
            onSelect={handleDateRangeSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <SalesCreateModal>
        <Button variant="default" className="md:w-1/4">
          Шинэ борлуулалт
        </Button>
      </SalesCreateModal>
    </div>
  );
};
