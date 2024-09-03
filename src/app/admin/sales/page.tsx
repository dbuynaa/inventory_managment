'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Plus,
  FileText,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';

// Mock data - replace with actual API calls in a real application
const mockSales = [
  {
    id: 'S001',
    date: '2023-06-15',
    customer: 'John Doe',
    total: 1299.99,
    paymentMethod: 'Credit Card',
    status: 'Completed'
  },
  {
    id: 'S002',
    date: '2023-06-14',
    customer: 'Jane Smith',
    total: 799.5,
    paymentMethod: 'PayPal',
    status: 'Completed'
  },
  {
    id: 'S003',
    date: '2023-06-13',
    customer: 'Bob Johnson',
    total: 2499.99,
    paymentMethod: 'Cash',
    status: 'Pending'
  },
  {
    id: 'S004',
    date: '2023-06-12',
    customer: 'Alice Brown',
    total: 599.99,
    paymentMethod: 'Credit Card',
    status: 'Completed'
  },
  {
    id: 'S005',
    date: '2023-06-11',
    customer: 'Charlie Davis',
    total: 1799.5,
    paymentMethod: 'Bank Transfer',
    status: 'Processing'
  }
];

export default function SalesPage() {
  const [sales, setSales] = useState(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    customer: '',
    total: '',
    paymentMethod: '',
    status: 'Pending'
  });

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === '' || sale.status === statusFilter)
    // (!dateRange.from || new Date() >= dateRange.from) &&
    // (!dateRange.to || new Date(sale.date) <= dateRange.to)
  );

  const handleNewSale = (e: React.FormEvent) => {
    e.preventDefault();
    const saleId = `S${(sales.length + 1).toString().padStart(3, '0')}`;
    const sale = {
      id: saleId,
      date: new Date().toISOString().split('T')[0],
      ...newSale,
      total: parseFloat(newSale.total)
    };
    // setSales([...sales, sale]);
    setIsNewSaleDialogOpen(false);
    setNewSale({
      customer: '',
      total: '',
      paymentMethod: '',
      status: 'Pending'
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue
              // defaultValue={'Pending'}
              placeholder="Filter by status"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
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
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from ?? new Date()}
              // defaultMonth={dateRange.from}
              // selected={dateRange}
              // onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Dialog
          open={isNewSaleDialogOpen}
          onOpenChange={setIsNewSaleDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="md:w-1/6">
              <Plus className="mr-2 h-4 w-4" /> New Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
              <DialogDescription>
                Enter the details for the new sale.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewSale}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Input
                    id="customer"
                    name="customer"
                    value={newSale.customer}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="total"
                    name="total"
                    type="number"
                    value={newSale.total}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Payment Method
                  </Label>
                  <Select
                    name="paymentMethod"
                    // onValueChange={(value) =>
                    //   handleInputChange({
                    //     target: { name: 'paymentMethod', value }
                    //   } as any)
                    // }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">
                        Bank Transfer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    name="status"
                    // onValueChange={(value) =>
                    //   handleInputChange({
                    //     target: { name: 'status', value }
                    //   } as any)
                    // }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Sale</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales List</CardTitle>
          <CardDescription>Manage and view all sales records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell>{sale.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
