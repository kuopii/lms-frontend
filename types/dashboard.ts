export type DashboardItem = {
  id: string;
  test_name: string;
  status: Status;
  module?: string;
  deadline?: string;
  type_test?: "reading" | "listening" | "speaking" | "writing";
  grade?: string;
  type?: "Assigned Test" | "Public Test" | "Practice Test";
  class?: string;
  created_at?: string;
  attemps?: string;
};

export type LeaderBoardItem = {
  student_name: string;
  score: number;
  status: Status;
  submission_date: Date | null;
};

export type Status =
  | "Done"
  | "To Do"
  | "Review"
  | "Closed"
  | "On Going"
  | "Schedule"
  | "Ontime"
  | "Late"
  | "Unsubmitted";

export enum AccurationType {
  lowest = "lowest",
  highest = "highest",
}
