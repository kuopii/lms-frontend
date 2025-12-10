import { dataTest } from "@/data/dummy-test";
import { useQuery } from "@tanstack/react-query";
import { DataTest } from "@/data/dummy-test";
import { findTestBySlug } from "@/lib/test-utils";

type UseFetchTest = {
  onError: (e: Error) => void;
  testName: string; // Changed from testId to testName (slug)
  userId: string;
};

export const useFetchTest = ({ onError, testName, userId }: UseFetchTest) => {
  return useQuery({
    queryFn: async () => {
      try {
        // Try to find test by slug name first
        let data: DataTest | undefined = findTestBySlug(dataTest, testName);

        // If not found, try to find first test by type (fallback for type-based URLs)
        // Only allow fallback for valid test types: reading, listening, speaking, writing
        if (!data) {
          const normalizedType = testName.toLowerCase();
          const validTestTypes = [
            "reading",
            "listening",
            "speaking",
            "writing",
          ];

          if (validTestTypes.includes(normalizedType)) {
            data = dataTest.find(
              (test) => test.type_test?.toLowerCase() === normalizedType,
            );
          }
        }

        // If still not found, create a better error message
        if (!data) {
          const availableTests = dataTest.map((t) => t.name).join(", ");
          throw new Error(
            `Test not found: "${testName}". Available tests: ${availableTests}. ` +
              `Use test name slug like "understanding-articles" or "can-you-hear-me"`,
          );
        }

        // const { data } = await axiosInstance.get(`/tests/${testName}`);
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!testName,
    queryKey: ["test", testName, userId],
  });
};
