import { Suspense } from "react";
import { SummaryDashboardPage } from "@/features/dashboard/pages/summary";

const SummaryDashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SummaryDashboardPage />
    </Suspense>
  );
};

export default SummaryDashboard;
