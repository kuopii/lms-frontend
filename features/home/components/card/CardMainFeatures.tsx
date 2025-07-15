import { cn } from "@/lib/utils";

type CardMainFeaturesParams = {
  variant: "portrait" | "landscape";
  title: string;
  description: string;
  image?: string;
  landscapeRightSide?: boolean;
};

const CardMainFeatures = ({
  variant,
  title,
  description,
  image,
  landscapeRightSide,
}: CardMainFeaturesParams) => {
  return (
    <div
      className={cn(
        "card-custom",
        variant === "portrait"
          ? "h-[480px] w-full md:w-[410px]"
          : "h-[276px] w-full md:w-[624px]",
      )}
    >
      {variant === "portrait" ? (
        <div className="flex h-full w-full flex-col justify-between">
          <div className="w-full">{/* image? */}</div>

          <div className="relative h-[169px] w-full rounded-b-[30px] border border-white/40">
            {/* gradient */}
            <div className="absolute z-0 h-full w-full bg-radial-[at_50%_25%] from-[#FFC107] to-[#333333] to-80% opacity-30"></div>
            <div className="flex flex-col gap-[25px] px-[25px] py-[15px]">
              <h3 className="z-10 text-[28px] font-semibold text-white">
                {title}
              </h3>
              <p className="text-description z-10 text-[14px]">{description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${landscapeRightSide ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`relative flex h-full w-1/2 items-center justify-center border border-white/40 md:w-[257px] ${landscapeRightSide ? "rounded-r-[30px]" : "rounded-l-[30px]"}`}
          >
            <div
              className={`absolute inset-0 z-0 opacity-20 ${
                landscapeRightSide
                  ? "bg-[radial-gradient(at_80%_25%,#FFC107,transparent_80%)]"
                  : "bg-[radial-gradient(at_80%_25%,#FFC107,transparent_80%)]"
              }`}
            />

            {/* Content */}
            <div className="relative flex flex-col gap-[25px] px-[20px]">
              <h3 className="z-10 text-[28px] font-semibold text-white">
                {title}
              </h3>
              <p className="text-description z-10 text-[14px]">{description}</p>
            </div>
          </div>

          <div className="h-full w-full flex-1">{/* image? */}</div>
        </div>
      )}
    </div>
  );
};

export default CardMainFeatures;
