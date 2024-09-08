import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreateOrderModal } from './create-order-modal';

export function OrderCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>
            Нийт Захиалууд <span>(25)</span>
          </CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Өнгөрсөн 30 хоногийн хугацаанд нийт захиалга
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <CreateOrderModal />
          {/* <Button>Шинэ захиалга үүсгэх</Button> */}
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <CardDescription>Хүлээгдэж буй Захиалууд</CardDescription>
          <CardTitle className="text-4xl">4</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Өнгөрсөн долоо хоногоос +25%
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label="25% өсөлт" />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2">
        <CardHeader className="pb-2">
          <CardDescription>Нийт Үнийн Дүн</CardDescription>
          <CardTitle className="text-4xl">$5,329</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Өнгөрсөн сард +10%
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={12} aria-label="12% өсөлт" />
        </CardFooter>
      </Card>
    </div>
  );
}
