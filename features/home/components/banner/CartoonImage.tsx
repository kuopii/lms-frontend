<<<<<<< HEAD
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
=======
import LazyImage from '@/components/imageReusable/base/LazyImage';

const CartoonImage = () => {
  return (
    <div className="relative w-full h-full">
      <LazyImage alt="english learning center" src={'/home/cartoon.png'} fill className="object-contain bg-center" />
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
    </div>
  );
};

export default CartoonImage;
