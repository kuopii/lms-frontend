import LazyImage from "@/components/imageReusable/base/LazyImage";

const CartoonImage = () => {
  return (
    <div className="relative h-full w-full">
      <LazyImage
        alt="english learning center"
        src={"/home/cartoon.png"}
        fill
        className="bg-center object-contain"
        sizes="600px"
      />
    </div>
  );
};

export default CartoonImage;
