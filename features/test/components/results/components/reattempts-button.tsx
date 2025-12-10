"use client";

import { useRouter } from "next/navigation";
import { GrSync } from "react-icons/gr";

interface Reattemps {
  testName?: string;
}

export default function ReattemptsButton({ testName }: Reattemps) {
  const router = useRouter();

  const handleRetake = () => {
    if (!testName) return;
    router.push(`/test/rewrite/${testName}`);
  };

  return (
    <button
      onClick={handleRetake}
      disabled={!testName}
      className="bg-primary flex items-center gap-3 rounded-[30px] px-[18px] py-[8px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      Retake Test
      <GrSync />
    </button>
  );
}
