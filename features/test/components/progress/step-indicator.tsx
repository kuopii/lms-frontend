import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number; // 1-indexed
  onStepChange?: (step: number) => void;
  className?: string;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  onStepChange,
  className,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const canPrev = currentStep > 1;
  const canNext = currentStep < totalSteps;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({
    start: 1,
    end: totalSteps,
  });
  const [maxVisible, setMaxVisible] = useState(10);

  useEffect(() => {
    const updateMaxVisible = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const stepWidth = 70; // 40px button + 12px gap + some margin
      const buttonSpace = 24; // Space for prev/next buttons (32px each)
      const availableWidth = containerWidth - buttonSpace;
      const maxVisibleCount = Math.max(
        2,
        Math.floor(availableWidth / stepWidth),
      );
      setMaxVisible(maxVisibleCount);
    };

    updateMaxVisible();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateMaxVisible, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentStep - half);
    const end = Math.min(totalSteps, start + maxVisible - 1);

    if (end === totalSteps) {
      start = Math.max(1, end - maxVisible + 1);
    }

    setVisibleRange({ start, end });
  }, [currentStep, totalSteps, maxVisible]);

  const goTo = (step: number) => {
    if (!onStepChange) return;
    const clamped = Math.max(1, Math.min(totalSteps, step));
    onStepChange(clamped);
  };

  const visibleSteps = steps.slice(visibleRange.start - 1, visibleRange.end);
  const hasHiddenBefore = visibleRange.start > 1;
  const hasHiddenAfter = visibleRange.end < totalSteps;

  return (
    <div
      ref={containerRef}
      className={`flex w-full items-center justify-center gap-2 sm:justify-normal ${className ?? ""}`}
    >
      <div
        className={`transition-all duration-200 ease-out ${
          canPrev ? "max-w-[32px] opacity-100" : "max-w-0 opacity-0"
        }`}
        aria-hidden={!canPrev}
      >
        <button
          type="button"
          aria-label="Previous step"
          disabled={!canPrev}
          onClick={() => goTo(currentStep - 1)}
          className={`rounded-full p-[10px] transition-colors ${
            canPrev
              ? "text-white hover:bg-[#7A9D58]"
              : "cursor-not-allowed border-transparent text-transparent"
          }`}
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex max-w-full items-center justify-center gap-3">
        {hasHiddenBefore && (
          <span className="text-sm font-semibold text-[#7A9D58]">...</span>
        )}

        {visibleSteps.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => goTo(step)}
            aria-current={step === currentStep ? "step" : undefined}
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold transition-all duration-200 ${
              step === currentStep
                ? "scale-110 bg-[#7A9D58] text-[#E0E9D8]"
                : "bg-green-100 text-[#7A9D58] hover:bg-[#7A9D58] hover:text-[#E0E9D8]"
            }`}
          >
            {step}
          </button>
        ))}

        {hasHiddenAfter && (
          <span className="text-sm font-semibold text-[#7A9D58]">...</span>
        )}
      </div>

      <div
        className={`transition-all duration-200 ease-out ${
          canNext ? "max-w-[32px] opacity-100" : "max-w-0 opacity-0"
        }`}
        aria-hidden={!canNext}
      >
        <button
          type="button"
          aria-label="Next step"
          disabled={!canNext}
          onClick={() => goTo(currentStep + 1)}
          className={`rounded-full p-[10px] transition-colors ${
            canNext
              ? "text-white hover:bg-[#7A9D58]"
              : "cursor-not-allowed border-transparent text-transparent"
          }`}
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StepIndicator;
