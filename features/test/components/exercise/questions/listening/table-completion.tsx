const TableCompletionListening = () => {
  return (
    <div className="bg-popover gap-5 rounded-[30px] p-[30px] text-white">
      <div className="grid grid-cols-4 gap-10">
        {/* ==== COLUMN 1 ==== */}
        <div>
          <h3 className="mb-4 border-r border-gray-500 pr-4 text-center font-semibold">
            Column Name
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <span>Content</span>

            <div className="font-semibold text-[#7ED957]">
              2<div className="mt-1 h-[1px] w-full bg-white"></div>
            </div>

            <span>Content</span>
            <span>Content</span>
            <span>Content</span>
          </div>
        </div>

        {/* ==== COLUMN 2 ==== */}
        <div>
          <h3 className="mb-4 border-r border-gray-500 pr-4 text-center font-semibold">
            Column Name
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <span>Content</span>

            <span>Content</span>

            <div className="font-semibold text-[#7ED957]">
              3<div className="mt-1 h-[1px] w-full bg-white"></div>
            </div>

            <span>Content</span>
            <span>Content</span>
          </div>
        </div>

        {/* ==== COLUMN 3 ==== */}
        <div>
          <h3 className="mb-4 border-r border-gray-500 pr-4 text-center font-semibold">
            Column Name
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <span>Content</span>
            <span>Content</span>
            <span>Content</span>
            <span>Content</span>

            <div className="font-semibold text-[#7ED957]">
              5<div className="mt-1 h-[1px] w-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* ==== COLUMN 4 ==== */}
        <div>
          <h3 className="mb-4 text-center font-semibold">Column Name</h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="font-semibold text-[#7ED957]">
              1<div className="mt-1 h-[1px] w-full bg-white"></div>
            </div>

            <span>Content</span>
            <span>Content</span>

            <div className="font-semibold text-[#7ED957]">
              4<div className="mt-1 h-[1px] w-full bg-white"></div>
            </div>

            <span>Content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCompletionListening;
