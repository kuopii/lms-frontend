import { Role } from "@/types/auth";
import { usePathname } from "next/navigation";
import { BsClipboard2CheckFill, BsStarFill } from "react-icons/bs";
import { MdOutlineAccessTimeFilled } from "react-icons/md";

interface CardDashboardParams {
  userRole: string;
}
export const CardDashboard = ({ userRole }: CardDashboardParams) => {
  const pathname = usePathname();

  const cardData = [
    {
      id: 1,
      name: "Tasks Completed",
      icon: <BsClipboard2CheckFill color="#7A9D58" size={24} />,
      text: "XX",
      borderColor: "#7A9D58",
      role: Role.STUDENT,
    },
    {
      id: 2,
      name: "Time Spent",
      icon: <MdOutlineAccessTimeFilled color="#0F68DC" size={24} />,
      text: "XX",
      borderColor: "#0F68DC",
      role: Role.STUDENT,
    },
    {
      id: 3,
      name: "Average Score",
      icon: <BsStarFill color="#FFC107" size={24} />,
      text: "XX",
      borderColor: "#FFC107",
      role: Role.STUDENT,
    },
  ];

  const isTeacher = userRole === Role.TEACHER;
  const isStudent = userRole === Role.STUDENT;
  const isDashListening = pathname === "/dashboard/listening";
  const isDashReading = pathname === "/dashboard/reading";
  const isDashWriting = pathname === "/dashboard/writing";
  const isDashSpeaking = pathname === "/dashboard/speaking";

  return (
    <section className="flex flex-col gap-[45px] md:pr-10 xl:pr-0">
      {/* title */}
      <div>
        <h2 className="text-[28px] font-semibold">
          {isStudent && isDashListening && "Listening Progress Dashboard"}
          {isStudent && isDashReading && "Reading Progress Dashboard"}
          {isStudent && isDashWriting && "Writing Progress Dashboard"}
          {isStudent && isDashSpeaking && "Speaking Progress Dashboard"}
        </h2>
      </div>

      {/* card */}
      <div className="flex flex-col gap-[34px] md:flex-row">
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
    </section>
  );
};
