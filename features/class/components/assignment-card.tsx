"use client";

import Image from "next/image";
import { format } from "date-fns";
import readingIllustration from "@/public/icons/reading-assignment-illustration.svg";
import listeningIllustration from "@/public/icons/listening-assignment-illustration.svg";
import speakingIllustration from "@/public/icons/speaking-assignment-illustration.svg";

interface AssignmentCardProps {
  id: string;
  name: string;
  type: "reading" | "listening" | "speaking" | "writing";
  deadline: Date;
}

export const AssignmentCard = ({
  assignment,
}: {
  assignment: AssignmentCardProps;
}) => {
  const img =
    assignment.type === "listening"
      ? listeningIllustration
      : assignment.type === "speaking"
        ? speakingIllustration
        : readingIllustration;

  return (
    <div
      key={assignment.id}
      className="group flex flex-col items-start justify-between gap-2 border-b px-2.5 py-5 last:border-b-0 hover:cursor-pointer hover:rounded-3xl hover:bg-[#E0E9D8] md:flex-row md:items-center md:gap-4"
    >
      <div className="flex items-center gap-9">
        <Image
          width={55}
          height={55}
          src={img}
          alt={assignment.name}
          className="rounded-full"
        />
        <div className="space-y-2 text-white group-hover:text-black">
          <h6 className="line-clamp-2 text-lg font-medium">
            {assignment.name}
          </h6>
          <span className="text-sm capitalize">{assignment.type}</span>
          <p className="mt-2 text-sm text-[#787878] md:hidden">
            Deadline:{" "}
            <span className="text-white group-hover:text-black">
              {format(assignment.deadline, "PPP")}
            </span>
          </p>
        </div>
      </div>
      <p className="hidden text-sm text-[#787878] md:block">
        Deadline:{" "}
        <span className="text-white group-hover:text-black">
          {format(assignment.deadline, "PPP")}
        </span>
      </p>
    </div>
  );
};
