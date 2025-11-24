import { FaExclamation } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

const DetailMisatake = () => {
  return (
    <div className="flex h-fit flex-col gap-6 overflow-hidden rounded-[30px] bg-[#333333] p-[35px] md:max-h-[900px]">
      <h2 className="flex justify-center text-[22px] font-medium">
        Detailed Mistakes & Corrections
      </h2>

      <div className="thin-scrollbar flex flex-col divide-y pr-12 text-white md:overflow-y-auto">
        <div className="grid grid-cols-[auto_1fr] gap-3 py-8">
          <span>1</span>
          <div className="flex flex-col gap-4">
            <p className="italic">
              &quot;Traveling abroad help people...&quot;
            </p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaExclamation className="text-[#BE212F]" size={24} />
              <span>
                Issue: &quot;Help&quot; is used with a singular subject
                &quot;Traveling abroad&quot;, which requires a singular verb.
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaCircleCheck className="text-primary" size={24} />
              <span>
                Correction: Use &quot;helps&quot; → &quot;Traveling abroad helps
                people…&quot;
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 py-8">
          <span>2</span>
          <div className="flex flex-col gap-4">
            <p className="italic">&quot;People also enjoys the food...&quot;</p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaExclamation className="text-[#BE212F]" size={24} />
              <span>
                Issue: &quot;People&quot; is plural, so the verb should be in
                base form.
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaCircleCheck className="text-primary" size={24} />
              <span>
                Correction: Use &quot;enjoy&quot; → &quot;People also enjoy the
                food…&quot;
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 py-8">
          <span>3</span>
          <div className="flex flex-col gap-4">
            <p className="italic">&quot;...local peoples&quot;</p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaExclamation className="text-[#BE212F]" size={24} />
              <span>
                Issue: &quot;People&quot; is already a plural noun;
                &quot;peoples&quot; refers to ethnic groups, which is incorrect
                here.
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaCircleCheck className="text-primary" size={24} />
              <span>
                Correction: Use &quot;people&quot; → &quot;local people&quot;
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 py-8">
          <span>4</span>
          <div className="flex flex-col gap-4">
            <p className="italic">&quot;gain new perspective&quot;</p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaExclamation className="text-[#BE212F]" size={24} />
              <span>
                Issue: &quot;Perspective&quot; should be plural to match the
                idea of multiple views.
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <FaCircleCheck className="text-primary" size={24} />
              <span>
                Correction: Use &quot;perspectives&quot; → &quot;gain new
                perspectives&quot;
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMisatake;
