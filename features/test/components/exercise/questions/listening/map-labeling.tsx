import Image from "next/image";

const MapLabelingListening = () => {
  return (
    <div className="grid grid-cols-1 gap-5 text-white lg:grid-cols-2">
      <div className="bg-popover flex h-fit flex-col items-center gap-5 rounded-[30px] p-[30px]">
        <h1>Art and the History in Sheepmarket</h1>
        <div>INI GAMBAR</div>
        <Image src="" alt="" width={300} height={200} />
      </div>

      <div className="flex h-fit flex-col gap-4">
        <div className="bg-popover grid grid-cols-[auto_1fr_auto] items-start gap-5 rounded-[30px] p-[30px]">
          <span className="text-primary text-[22px] font-medium">1</span>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elitLorem ipsum
            dolor sit amet consectetur adipiscing elitLorem ipsum dolor sit amet
            consectetur adipiscing elitLorem ipsum dolor sit amet consectetur
            adipiscing elitLorem ipsum dolor sit amet consectetur adipiscing
            elitLorem ipsum dolor sit amet consectetur adipiscing elit
          </p>
          <input type="text" className="self-center border-b-1 outline-none" />
        </div>
        <div className="bg-popover rounded-[30px] p-[30px]">askjds</div>
        <div className="bg-popover rounded-[30px] p-[30px]">askjds</div>
      </div>
    </div>
  );
};

export default MapLabelingListening;
