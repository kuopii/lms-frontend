import { CheckCircle, Clock, XCircle, Eye, Calendar } from "lucide-react";
import type { Status } from "@/types/dashboard";

export function getStatusConfig(status: Status) {
  switch (status) {
    case "Done":
      return {
        label: "Done",
        icon: <CheckCircle className="h-4 w-4" />,
        className: "bg-green-500/20 text-green-500",
      };
    case "To Do":
      return {
        label: "To Do",
        icon: <Clock className="h-4 w-4" />,
        className: "bg-yellow-500/20 text-yellow-500",
      };
    case "Review":
      return {
        label: "Review",
        icon: <Eye className="h-4 w-4" />,
        className: "bg-blue-500/20 text-blue-500",
      };
    case "Closed":
      return {
        label: "Closed",
        icon: <XCircle className="h-4 w-4" />,
        className: "bg-gray-500/20 text-gray-500",
      };
    case "On Going":
      return {
        label: "On Going",
        icon: <Clock className="h-4 w-4" />,
        className: "bg-green-500/20 text-green-500",
      };
    case "Schedule":
      return {
        label: "Schedule",
        icon: <Calendar className="h-4 w-4" />,
        className: "bg-orange-500/20 text-orange-500",
      };
    default:
      return {
        label: status,
        icon: null,
        className: "bg-muted text-foreground",
      };
  }
}
