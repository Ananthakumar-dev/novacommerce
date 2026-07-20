import { NovaLoader } from "@/components/ui/nova-loader"

export default function Loading() {
  return <NovaLoader overlay={true} message="Loading page content..." />
}
