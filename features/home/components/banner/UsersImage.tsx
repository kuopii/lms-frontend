import Image from "next/image";

const UsersImage = () => {
  return (
    <div className="relative h-[45px] w-[135px]">
      <Image
        alt="users"
        src={"/home/ellipseImage.png"}
        fill
        className="object-contain"
        sizes="70px"
        loading="lazy"
      />
    </div>
  );
};

export default UsersImage;
