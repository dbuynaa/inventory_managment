import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination';
import { api } from '@/trpc/server';

import { Separator } from '@radix-ui/react-select';
import { format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck
} from 'lucide-react';

export async function OrderDetails({ orderId }: { orderId: string }) {
  const data = await api.order.getById({ id: orderId });
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {data.id.substring(0, 6)}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Захиалгын ID-ийг хуулбарлах</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Огноо: {format(data.createdAt, 'dd MMM yyyy')}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Захиалгыг хянах
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">Илүү их</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Засах</DropdownMenuItem>
              <DropdownMenuItem>Экспортлох</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Хаях</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Үйлдвэрлэлийн Мэдээлэл</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Төлөв</dt>
              <dd>{data.status}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Хүлээгдэж буй Дата</dt>
              <dd>{format(data.expectedDeliveryDate, 'dd MMM yyyy')}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Нийт Үнийн Дүн</dt>
              <dd>
                <a href="mailto:">${data.totalAmount}</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />

        <div className="grid gap-3">
          <div className="font-semibold">Захиалгын Дэлгэрэнгүй Мэдээлэл</div>
          <ul className="grid gap-3">
            {data.purchaseOrderDetails.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {item.product?.name} x <span>{item.quantity}</span>
                </span>
                <span>${item.totalPrice}</span>
              </li>
            ))}
          </ul>
          {/* <Separator className="my-2" /> */}
        </div>

        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Ний supplier-ийн Мэдээлэл</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Нэр</dt>
              <dd>{data.supplier.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Имэйл</dt>
              <dd>
                <a href="mailto:">{data.supplier.email}</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Утас</dt>
              <dd>
                <a href="tel:">{data.supplier.phoneNumber}</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Төлбөрийн Мэдээлэл</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Visa
              </dt>
              <dd>**** **** **** 4532</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Шинэчлэгдсэн <time dateTime="2023-11-23">2023 оны 11-р сарын 23</time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Өмнөх Захиалга</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Дараагийн Захиалга</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
