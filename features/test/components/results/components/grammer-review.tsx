import React, { useState, useEffect } from "react";
import { IoMdVolumeHigh } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

const GrammerReview = () => {
  const [activeTab, setActiveTab] = useState("grammer");

  useEffect(() => {
    setActiveTab("grammar");
  }, []);

  return (
    <div className="flex h-fit flex-col rounded-[30px] bg-[#333333] p-[35px] md:max-h-[900px]">
      {/* Tabs */}
      <div className="mb-6 border-b-2 border-[#DEDEDE] pb-6">
        <div className="grid grid-cols-2 items-center justify-center gap-2 rounded-[30px] border-1 px-[15px] py-[10px] text-[22px] font-medium text-white">
          <button
            onClick={() => setActiveTab("grammar")}
            className={`rounded-full px-[15px] py-[10px] transition-all duration-300 ease-in-out ${
              activeTab === "grammar" ? "bg-primary" : "hover:bg-[#444444]"
            }`}
          >
            Grammar Explanation
          </button>

          <button
            onClick={() => setActiveTab("review")}
            className={`rounded-full px-[15px] py-[10px] transition-all duration-300 ease-in-out ${
              activeTab === "review" ? "bg-primary" : "hover:bg-[#444444]"
            }`}
          >
            Review Suggestions
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "grammar" ? (
        <div className="thin-scrollbar grid grid-cols-[auto_1fr] gap-3 text-white md:overflow-y-auto">
          <span>1</span>
          <div className="flex flex-col gap-10">
            <p className="italic">
              &quot;My brother he like play football every weekend with his
              friend.&quot;
            </p>

            <div className="flex flex-col gap-3">
              <p className="italic">
                &quot;My Brother he&quot; <span>—</span>
              </p>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaExclamation className="text-[#BE212F]" size={24} />
                <span>
                  Issue: The word &quot;friend&quot; is singular, but the
                  context (&quot;every weekend&quot;) suggests a habitual
                  activity involving more than one person.
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaCircleCheck className="text-primary" size={24} />
                <span>
                  Correction: Use only one subject to keep the sentence coherent
                  and fluent.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="italic">
                &quot;friend&quot; <span>—</span>
              </p>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaExclamation className="text-[#BE212F]" size={24} />
                <span>
                  Issue: The word &quot;friend&quot; is singular, but the
                  context (&quot;every weekend&quot;) suggests a habitual
                  activity involving more than one person.
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaCircleCheck className="text-primary" size={24} />
                <span>
                  Correction: Use the plural form &quot;friends&quot; to better
                  describe the situation.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="italic">
                &quot;like play&quot; <span>—</span>
              </p>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaExclamation className="text-[#BE212F]" size={24} />
                <span>
                  Issue: &quot;like play&quot; is grammatically incorrect. It
                  should be &quot;likes to play&quot; or &quot;likes
                  playing&quot; (third-person singular subject).
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaCircleCheck className="text-primary" size={24} />
                <span>
                  Correction: Apply the correct verb form (likes) and use the
                  proper verb structure and plural noun.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="italic">
                &quot;football&quot; <span>—</span>
              </p>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaExclamation className="text-[#BE212F]" size={24} />
                <span>
                  Issue: &quot;football&quot;, saying /&apos;fut.bɔːl/ instead
                  of /&apos;fʊt.bɔːl/.
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <FaCircleCheck className="text-primary" size={24} />
                <span>
                  Correction: Emphasize correct word stress in compound nouns
                  like football (stress on the first syllable: FOOTball).
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="thin-scrollbar flex flex-col gap-3 md:overflow-y-auto">
          <div className="grid grid-cols-[auto_auto_1fr] items-center gap-3 text-white">
            <span className="text-[22px] font-medium">1</span>
            <IoMdVolumeHigh size={20} />
            <p className="text-base font-normal">
              My brother likes playing football every weekend with his friends.
            </p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] items-center gap-3 text-white">
            <span className="text-[22px] font-medium">2</span>
            <IoMdVolumeHigh size={20} />
            <p className="text-base font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] items-center gap-3 text-white">
            <span className="text-[22px] font-medium">3</span>
            <IoMdVolumeHigh size={20} />
            <p className="text-base font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] items-center gap-3 text-white">
            <span className="text-[22px] font-medium">4</span>
            <IoMdVolumeHigh size={20} />
            <p className="text-base font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>
          <div className="grid grid-cols-[auto_auto_1fr] items-center gap-3 text-white">
            <span className="text-[22px] font-medium">5</span>
            <IoMdVolumeHigh size={20} />
            <p className="text-base font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammerReview;
