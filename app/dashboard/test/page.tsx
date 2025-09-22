import { Suspense } from "react";
import { DiscoverTestPage } from "@/features/discover-test/pages/discover-test";

const DiscoverTest = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverTestPage />
    </Suspense>
  );
};

export default DiscoverTest;
