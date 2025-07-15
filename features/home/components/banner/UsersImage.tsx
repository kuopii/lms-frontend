import LazyImage from '@/components/imageReusable/base/LazyImage';

const UsersImage = () => {
  return (
    <div className="relative w-[135px] h-[45px]">
      <LazyImage alt="users" src={'/home/ellipseImage.png'} fill className="object-contain" sizes="70px" />
    </div>
  );
};

export default UsersImage;
