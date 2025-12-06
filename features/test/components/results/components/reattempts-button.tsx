"use client";

import { useRouter } from "next/navigation";
import { GrSync } from "react-icons/gr";

interface Reattemps {
  testId?: string;
}

export default function ReattemptsButton({ testId }: Reattemps) {
  const router = useRouter();

  const handleRetake = () => {
    if (!testId) return;
    router.push(`/test/rewrite/${testId}`);
  };

  return (
    <button
      onClick={handleRetake}
      disabled={!testId}
      className="bg-primary flex items-center gap-3 rounded-[30px] px-[18px] py-[8px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      Retake Test
      <GrSync />
    </button>
  );
}
