import LazyImage from "@/components/imageReusable/base/LazyImage";
import { Badge } from "@/components/ui/badge";
import { FaCircleArrowRight } from "react-icons/fa6";
import { MdDone } from "react-icons/md";

interface CardPricingParams {
  title: string;
  price: string;
  description: string;
  getstarted: string;
  information: string[];
  popular?: boolean;
}

const CardPricing = ({
  popular,
  description,
  getstarted,
  information,
  price,
  title,
}: CardPricingParams) => {
  console.log("information?", information);

  return (
    <div
      className={`card-custom hover:shadow-primary z-10 px-[20px] py-[20px] text-white hover:border hover:shadow-[0_0_20px_rgba(0,0,0,0.25)] ${
        popular
          ? "shadow-primary h-[530px] w-[370px] shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)] lg:h-[540px] lg:w-[430px]"
          : "h-[510px] w-[350px] border-none lg:h-[510px] lg:w-[400px]"
      }`}
    >
      <div className="flex flex-col gap-[30px]">
        <div className="flex items-center justify-between">
          <h4 className="text-[28px] font-semibold">{title}</h4>
          {popular && <Badge variant={"custom"}>Popular</Badge>}
        </div>
        <p>{description}</p>

        <div className="flex">
          <div className="relative h-[40px] w-[40px]">
            <LazyImage
              fill
              src={"/pricing/dollar.png"}
              alt="dollar"
              sizes="40px"
              className="object-contain"
            />
          </div>
          <p className="text-[55px] font-extrabold">{price}</p>
        </div>

        <button className="bg-primary flex w-full justify-between rounded-[30px] px-[15px] py-[8px]">
          <p className="text-[16px]">{getstarted}</p>
          <FaCircleArrowRight size={25} />
        </button>
        <div>
          <ul className="flex flex-col gap-4">
            {information.map((e, idx) => (
              <li key={idx} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <MdDone size={24} color="#7a9d58" />
                  <p>{e}</p>
                </div>

                {idx < information.length - 1 && (
                  <span className="h-[1px] w-full bg-[#dedede]"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardPricing;
