import { DashboardData } from "@/app/dashboard/columns";

export async function getData(): Promise<DashboardData[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      testName: "Test A",
      module: "Reading",
      deadline: "YYYY - MM - DD",
      status: "Done",
      grade: "A",
      type: "Assigned Test",
      attempts: "20/12",
    },
    {
      id: "728ed52g",
      testName: "Test B",
      module: "Listening",
      deadline: "25-03-1992",
      status: "Review",
      grade: "B",
      type: "Public Test",
      attempts: "20/12",
    },
    {
      id: "728ed52h",
      testName: "Test C",
      module: "Speaking",
      deadline: "YYYY - MM - DD",
      status: "To Do",
      grade: "C",
      type: "Public Test",
      attempts: "20/12",
    },
    {
      id: "728ed52i",
      testName: "Test D",
      module: "Writing",
      deadline: "YYYY - MM - DD",
      status: "done",
      grade: "D",
      type: "Public Test",
      attempts: "20/12",
    },
  ];
}
