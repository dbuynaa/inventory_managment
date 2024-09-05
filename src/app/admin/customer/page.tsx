import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/server';
import { DataTable } from '@/components/form/data-table';
import { customerColumns } from './_components/column';
import CustomerHeader from './_components/customer-header';

interface paramsProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function CustomerPage({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const data = await api.customer.getMany({
    limit: limit,
    page: page
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {data.total} Total Customers
          </div>
        </CardContent>
      </Card> */}

      <CustomerHeader />

      <DataTable
        columns={customerColumns}
        data={data.data}
        total={data.total}
        limit={limit}
        page={page}
      />

      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentCustomer(customer);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  );
}
