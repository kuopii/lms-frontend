"use client";

interface TotalQuestionProps {
  testData?: {
    type_test?: string;
    [key: string]: unknown;
  };
  className?: string;
  totalQuestions?: number;
}

const TotalQuestion = ({
  testData,
  className,
  totalQuestions,
}: TotalQuestionProps) => {
  // Hitung total questions dari testData jika tersedia
  const getTotalQuestions = (): number => {
    if (totalQuestions !== undefined) {
      return totalQuestions;
    }

    // Coba hitung dari struktur data test
    if (testData && typeof testData === "object") {
      // Untuk speaking: passages[].questions[]
      if (testData.passages && Array.isArray(testData.passages)) {
        let count = 0;
        testData.passages.forEach((passage: unknown) => {
          if (
            passage &&
            typeof passage === "object" &&
            "questions" in passage &&
            Array.isArray(passage.questions)
          ) {
            count += passage.questions.length;
          }
        });
        if (count > 0) return count;
      }
    }

    // Default value jika tidak ditemukan
    return 0;
  };

  const total = getTotalQuestions();

  return (
    <div className={`flex w-full items-center ${className ?? ""}`}>
      <div className="flex items-center gap-2 rounded-[30px] bg-[var(--tertiary)] px-[15px] py-[10px]">
        <span className="text-[22px] font-medium text-[#787878]">Total:</span>
        <span className="text-primary text-[28px] font-semibold">
          {total > 0 ? total : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default TotalQuestion;
