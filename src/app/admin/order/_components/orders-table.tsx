import { File, ListFilter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/trpc/server';
import { DataTable } from '@/components/form/data-table';
import { columns } from './column';

export async function OrderDataTable({
  limit,
  page
}: {
  limit: number;
  page: number;
}) {
  const data = await api.order.getMany({
    limit: limit,
    page: page
  });
  return (
    <Tabs defaultValue="week">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="week">Долоо хоног</TabsTrigger>
          <TabsTrigger value="month">Сар</TabsTrigger>
          <TabsTrigger value="year">Жил</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Шүүлт</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Шүүхийн төрлүүд</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Хэрэгжүүлсэн
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Татгалзсан</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Буцаагдсан</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Экспортлох</span>
          </Button>
        </div>
      </div>
      <TabsContent value="week">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Захиалгууд</CardTitle>
            <CardDescription>
              Таны дэлгүүрээс сүүлийн үеийн захиалгууд.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data.data}
              limit={10}
              page={1}
              total={data.total}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
