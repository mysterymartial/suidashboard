import { cn } from "@/lib/utils"

function Skeleton({ className, height, width, ...props }: React.ComponentProps<"div"> & { height?: string; width?: string }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-700 animate-pulse rounded-md", className)}
      style={{ height, width }}
      {...props}
    />
  )
}

function TableRowSkeleton({ columns }: { columns: number }) {
  return (
    <tr className="border border-[#DCDCDC]">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="py-4">
          <Skeleton height="1rem" width="80%" />
        </td>
      ))}
    </tr>
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <Skeleton height="1rem" width="60%" className="mb-2" />
      <Skeleton height="2rem" width="40%" />
    </div>
  )
}

function ChartSkeleton({ height = "200px" }: { height?: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <Skeleton height="1rem" width="40%" className="mb-4" />
      <Skeleton height={height} width="100%" />
    </div>
  )
}

export { Skeleton, TableRowSkeleton, StatCardSkeleton, ChartSkeleton }
