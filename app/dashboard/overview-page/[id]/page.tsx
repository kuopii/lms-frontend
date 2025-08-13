import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dataListening } from "@/data/dummy-data-listening";
import { Role } from "@/types/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";

// --------------------------
// NOTE : page ini di trigger dari dashboard student dengan dynamic routes

// dari BE
const userData = {
  id: "1",
  name: "anton",
  role: "student",
};

// --------------------------

interface TypeTestPageParams {
  typeTestName?: string;
  testName?: string;
  description?: string;
  levelTest?: string;
  dateTest?: string;
  buttonTextAttempTest?: string;
  buttonTextRetake?: string;
  buttonTextVocabulary?: string;
  buttonTextExplanation?: string;
  lastScore?: string;
  lastScoreText?: string;
  everTest?: boolean;
  attemptsText?: string;
  attempts?: string;
  role?: Role;
}

const TypeTestPage = ({
  typeTestName,
  testName,
  description,
  levelTest,
  dateTest,
  buttonTextAttempTest,
  buttonTextRetake,
  buttonTextVocabulary,
  buttonTextExplanation,
  everTest,
  lastScore,
  lastScoreText,
  attemptsText,
  attempts,
  role,
}: TypeTestPageParams) => {
  return (
    <div className="flex flex-col gap-[35px]">
      <Link href={"/dashboard/listening"}>
        <ArrowLeft />
      </Link>

      <div className="flex flex-col gap-[30px] text-white">
        <div>
          <Button variant={"custom2"} size={"custom2"}>
            {typeTestName}
          </Button>
        </div>

        <div className="flex flex-col gap-[25px]">
          <h3 className="text-[28px]">{testName}</h3>
          <p>{description}</p>
        </div>

        <div className="flex flex-col gap-[30px]">
          <div className="flex items-center gap-4">
            <p className="typoSubHeadlines">{levelTest}</p>
            <div className="flex items-center justify-center">
              <span className="h-[7px] w-[7px] rounded-full bg-white"></span>
            </div>
            <p className="text-[14px] text-[#dedede]">{dateTest}</p>
          </div>

          <div>
            {everTest && role === Role.STUDENT && (
              <div className="flex items-center gap-4">
                <p className="typoSubHeadlines">
                  {lastScoreText} : {lastScore}
                </p>
                <div className="flex items-center justify-center">
                  <span className="h-[7px] w-[7px] rounded-full bg-white"></span>
                </div>
                <p className="flex text-[14px] text-[#DC3545]">
                  {attemptsText} : {attempts}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* button */}
        <div className="flex w-full gap-[20px]">
          {everTest && role === Role.STUDENT ? (
            <>
              <Button
                variant={"custom"}
                size={"custom"}
                className="flex gap-[11px]"
              >
                {buttonTextRetake}
                <FaCirclePlay className="size-[20px]" />
              </Button>

              <Button
                variant={"custom"}
                size={"custom"}
                className="border-primary flex gap-[11px] border bg-transparent"
              >
                {buttonTextVocabulary}
                <FaBookOpen className="size-[20px]" />
              </Button>

              <Button
                variant={"custom"}
                size={"custom"}
                className="border-primary flex gap-[11px] border bg-transparent"
              >
                {buttonTextExplanation}
                <BsFileEarmarkCheckFill className="size-[20px]" />
              </Button>
            </>
          ) : (
            <Button
              variant={"custom"}
              size={"custom"}
              className="flex gap-[11px]"
            >
              {buttonTextAttempTest}
              <FaCirclePlay className="size-[20px]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentListening = () => {
  // mangambil data apakah sudah pernah melakukan test? (*fetch data disini)
  const user = {
    ...userData,
    role: userData.role as Role,
  };

  return (
    <div>
      {dataListening.map((e) => (
        //   ini dummy data
        <TypeTestPage
          key={e.id}
          buttonTextAttempTest="Attempt the Test"
          buttonTextRetake="Retake the Test"
          buttonTextVocabulary="Vocabulary"
          buttonTextExplanation="View Explanation"
          dateTest={e.created_at}
          levelTest={e.level}
          description={e.description}
          testName={e.testName}
          typeTestName={e.typeTestName}
          everTest={e.everTest}
          lastScoreText="Last Score"
          lastScore={e.lastScore}
          attemptsText="Attempts"
          attempts={e.Attempts}
          role={user.role}
        />
      ))}
    </div>
  );
};

const TeacherListening = () => {
  const role = userData.role;
  return (
    <div>
      <p>teacher pages</p>
    </div>
  );
};

const page = () => {
  const user = {
    ...userData,
    role: userData.role as Role,
  };

  return (
    <div>
      {user.role === Role.STUDENT ? <StudentListening /> : <TeacherListening />}
    </div>
  );
};

export default page;
