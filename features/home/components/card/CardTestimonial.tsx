import Image from "next/image";

interface CardTestimonialParams {
  src?: string;
  name: string;
  email: string;
  description: string;
}

const CardTestimonial = ({
  src,
  description,
  email,
  name,
}: CardTestimonialParams) => {
  return (
    <div className="card-custom flex h-[323px] w-[330px] flex-col items-center justify-center gap-[20px]">
      {/* image */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-[70px] w-[70px]">
          <Image
            alt="profile"
            src={src ?? "/home/ProfileTesti.png"}
            className="rounded-full border object-cover"
            fill
            sizes="70px"
            loading="lazy"
          />
        </div>
        <p className="text-[22px] font-medium">{name}</p>
        <p className="text-description text-[14px]">{email}</p>
      </div>

      <div className="text-center text-[16px]/6">
        <p>{description}</p>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative h-[30px] w-[30px]">
          <Image
            alt="kutip"
            src={"/home/kutip.png"}
            fill
            className="object-contain"
            sizes="30px"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default CardTestimonial;
