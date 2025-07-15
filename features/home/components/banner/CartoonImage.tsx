import LazyImage from '@/components/imageReusable/base/LazyImage';

const CartoonImage = () => {
  return (
    <div className="relative w-full h-full">
      <LazyImage alt="english learning center" src={'/home/cartoon.png'} fill className="object-contain bg-center" />
    </div>
  );
};

export default CartoonImage;
