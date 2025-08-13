import { TimeType } from "@/types/test";

export const formatTimeLabel = (type: TimeType): string => {
  const labels = {
    countdown: "Count Down",
    countup: "Count Up",
    notimer: "No Timer",
  } as const;
  return labels[type];
};
