import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SpecieCardSkeleton() {
  return (
    <div className="w-full lg:w-[280px]">
      <Card className="p-0 border-0 overflow-hidden w-full h-[500px] md:h-[390px]">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="w-full flex-1 overflow-hidden">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <CardFooter className="p-4 h-[110px] min-h-[110px]">
            <div className="flex w-full flex-col justify-between h-full">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center gap-2 self-end">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
