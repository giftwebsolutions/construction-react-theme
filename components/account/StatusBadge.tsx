import type { OrderStatus, QuoteStatus } from "@/types";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const ORDER: Record<OrderStatus, [string, BadgeTone]> = {
  placed: ["Placed", "neutral"],
  confirmed: ["Confirmed", "primary"],
  dispatched: ["Dispatched", "primary"],
  "out-for-delivery": ["Out for delivery", "warning"],
  delivered: ["Delivered", "success"],
  cancelled: ["Cancelled", "danger"],
};
const QUOTE: Record<QuoteStatus, [string, BadgeTone]> = {
  submitted: ["Submitted", "neutral"],
  "under-review": ["Under review", "warning"],
  quoted: ["Quote ready", "primary"],
  accepted: ["Accepted", "success"],
  expired: ["Expired", "neutral"],
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => <Badge tone={ORDER[status][1]} size="md">{ORDER[status][0]}</Badge>;
export const QuoteStatusBadge = ({ status }: { status: QuoteStatus }) => <Badge tone={QUOTE[status][1]} size="md">{QUOTE[status][0]}</Badge>;
