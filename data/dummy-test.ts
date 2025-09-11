import { ModuleType } from "@/types/class";

export type DataTest = {
  id: string;
  type_test: ModuleType;
  name: string;
  description: string;
  level: string;
  created_at: string;
  last_score: number;
  reapeatation: {
    max_reapeatation: number;
    current_reapeatation: number;
  };
};

export const dataTest: DataTest[] = [
  {
    id: "1",
    type_test: ModuleType.Listening,
    name: "Can you hear me",
    description:
      "This test is designed to evaluate your listening skills in everyday conversations. You will listen to short dialogues and longer discussions, then answer questions to check your ability to understand context, tone, and specific details. The goal is to strengthen your comprehension of natural spoken English.",
    level: "intermediate",
    created_at: "2 May 2025",
    last_score: 100,
    reapeatation: {
      max_reapeatation: 3,
      current_reapeatation: 2,
    },
  },
  {
    id: "2",
    type_test: ModuleType.Reading,
    name: "Understanding Articles",
    description:
      "This test measures your reading comprehension by presenting short passages, articles, and news reports. You will be asked to identify main ideas, supporting details, and vocabulary in context. It helps improve your ability to process written English effectively and develop critical thinking skills while reading.",
    level: "beginner",
    created_at: "10 May 2025",
    last_score: 0,
    reapeatation: {
      max_reapeatation: 3,
      current_reapeatation: 3,
    },
  },
  {
    id: "3",
    type_test: ModuleType.Speaking,
    name: "Daily Conversation",
    description:
      "This test evaluates your speaking ability through simulated real-life conversations. You will be required to respond naturally to different scenarios, focusing on pronunciation, fluency, grammar accuracy, and vocabulary usage. The test aims to build your confidence in using English in practical situations.",
    level: "advanced",
    created_at: "18 May 2025",
    last_score: 85,
    reapeatation: {
      max_reapeatation: 2,
      current_reapeatation: 1,
    },
  },
  {
    id: "4",
    type_test: ModuleType.Writing,
    name: "Short Essay",
    description:
      "This test assesses your writing skills by asking you to create a short essay based on a given topic. You will be evaluated on grammar, sentence structure, vocabulary, coherence, and clarity of ideas. It encourages you to express thoughts in written form with proper organization and logical flow.",
    level: "intermediate",
    created_at: "25 May 2025",
    last_score: 0,
    reapeatation: {
      max_reapeatation: 2,
      current_reapeatation: 0,
    },
  },
];
