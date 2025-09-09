import Image from "next/image";

const CartoonImage = () => {
  return (
    <div className="relative h-full w-full">
      <Image
        alt="english learning center"
        src={"/home/cartoon.png"}
        fill
        loading="lazy"
        className="bg-center object-contain"
        sizes="600px"
      />
    </div>
  );
};

export default CartoonImage;
