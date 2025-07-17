import LazyImage from '@/components/imageReusable/base/LazyImage';

interface CardTestimonialParams {
  src?: string;
  name: string;
  email: string;
  description: string;
}

const CardTestimonial = ({ src, description, email, name }: CardTestimonialParams) => {
  return (
    <div className="card-custom w-[330px] h-[323px] flex flex-col gap-[20px] items-center justify-center">
      {/* image */}
      <div className="flex flex-col justify-center items-center ">
        <div className="relative w-[70px] h-[70px]">
          <LazyImage alt="profile" src={src ?? '/home/ProfileTesti.png'} className="rounded-full border object-cover" fill sizes="70px" />
        </div>
        <p className="text-[22px] font-medium">{name}</p>
        <p className="text-[14px] text-description">{email}</p>
      </div>

      <div className="text-center text-[16px]/6 ">
        <p>{description}</p>
      </div>

      <div className="flex justify-center items-center">
        <div className="relative w-[30px] h-[30px]">
          <LazyImage alt="kutip" src={'/home/kutip.png'} fill className="object-contain" sizes="30px" />
        </div>
      </div>
    </div>
  );
};

export default CardTestimonial;
