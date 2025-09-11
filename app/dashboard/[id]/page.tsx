"use client";

import { Separator } from "@/components/ui/separator";
import { getData } from "@/data/dummy-dashboard-data";
import { Role } from "@/types/auth";
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { BsRecycle } from "react-icons/bs";
import { DashboardData, useColumns } from "../columns";
import { DataTable } from "../data-table";
import { UserData } from "../page";

// COMPONENT TEST REPORT
interface ReportCompParams {
  testReportData: DashboardData;
  data: DashboardData[]; //(only test) ini kemungkinan data diganti dari salah satu test yang berisikan beberapa student
}
export const ReportComp = ({
  testReportData,
  data,
}: ReportCompParams): JSX.Element | null => {
  const router = useRouter();

  // diganti dengan state global
  const userData: UserData = {
    name: "user",
    role: Role.STUDENT,
  };
  const userRole = userData.role;

  const cardData = [
    {
      id: 1,
      name: "Highest Score",
      icon: <ArrowUp color="#7A9D58" size={24} />,
      text: "XX",
      borderColor: "#7A9D58",
      role: Role.TEACHER,
    },
    {
      id: 2,
      name: "Average Score",
      icon: <BsRecycle color="#0F68DC" size={24} />,
      text: "XX",
      borderColor: "#0F68DC",
      role: Role.TEACHER,
    },
    {
      id: 3,
      name: "Lowest Score",
      icon: <ArrowDown color="#DC3545" size={24} />,
      text: "XX",
      borderColor: "#DC3545",
      role: Role.TEACHER,
    },
  ];

  const columnsByRole = useColumns(userRole);

  if (userRole !== Role.TEACHER) {
    router.push("/dashboard");
  }

  if (!testReportData) return null;
  console.log("userRole", userRole);

  return (
    <div className="md:pr-10 xl:pr-0">
      <div className="flex items-center gap-[20px] pb-[25px]">
        <Link href={"/dashboard"}>
          <ArrowLeft className="size-[24px]" />
        </Link>
        <h2 className="flex w-full items-center text-[28px] font-semibold">
          Test Report
        </h2>
      </div>

      {/* header  */}
      <div className="flex w-full flex-col items-center justify-center gap-[15px] pl-[44px] text-white">
        <h3 className="text-[22px] font-medium">{testReportData.testName}</h3>
        <div className="flex w-full flex-col items-center justify-center gap-[25px] text-[16px] md:flex-row">
          <p>Attempts : {testReportData.attempts}</p>
          <p>Class Name : Nama kelas Hard Code</p>
          <p>Date : {testReportData.deadline}</p>
        </div>
        <Separator />
      </div>

      {/* card */}
      <div className="flex flex-col gap-[34px] py-[30px] pl-[44px] md:flex-row">
        {cardData
          .filter((e) => e.role === userRole)
          .map((e, idx) => {
            return (
              <div
                key={idx}
                className="flex h-[110px] w-[216px] flex-col justify-between rounded-[15px] border p-[10px]"
              >
                <div className="flex items-center gap-[10px]">
                  <span>{e.icon}</span>
                  <p className="text-[16px] text-[#dedede]">{e.name}</p>
                </div>
                <div>
                  <p
                    className={`w-fit border-b-2 text-[36px] font-bold`}
                    style={{ borderColor: e.borderColor }}
                  >
                    {e.text}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* performance question */}
      <div className="mb-[30px] pl-[44px]">
        <div className="rounded-[30px] bg-[#333333] px-[18px] py-[15px]">
          <div className="mb-[25px] flex flex-col gap-2">
            <h3 className="text-[22px] font-medium text-white">
              Most Commonly Mistaken Questions
            </h3>
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] text-[#dedede]">
                Based on lowest accuracy
              </p>
              <Separator className="text-white" />
            </div>
          </div>

          <div className="text-white">
            <ul className="list-disc space-y-4 pl-5">
              <li>
                <div className="flex items-center gap-2">
                  <span>Q4 - Misleading keywords</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <p className="text-[#DC3545]">68% wrong</p>
                <Separator className="mt-[15px] text-white/40" />
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span>Q4 - Misleading keywords</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <p className="text-[#DC3545]">68% wrong</p>
                <Separator className="mt-[15px] text-white/40" />
              </li>
              <li className="">
                <div className="flex items-center gap-2">
                  <span>Q4 - Misleading keywords</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <p className="text-[#DC3545]">68% wrong</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Table Leaderboard */}
      <div className="pl-[44px]">
        <div className="container mx-auto rounded-[30px] bg-[#333333] px-[20px] py-[15px]">
          <DataTable columns={columnsByRole} data={data} />
        </div>
      </div>
    </div>
  );
};

// GET TEST REPORT ID
export async function getProductById(id: string) {
  const data = await getData();
  console.log("data", data);

  const result = data.find((p) => p.id === id);
  console.log("result", result);
  return result;
}

// PAGE DYNAMIC TEST REPORT
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testReportData = await getProductById(id);
  console.log("testReportData", testReportData);
  const data = await getData();

  if (!testReportData) return null;
  return (
    <div>
      <ReportComp testReportData={testReportData} data={data} />
    </div>
  );
}
