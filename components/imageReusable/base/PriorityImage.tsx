import Image, { ImageProps } from 'next/image';

type PriorityImageType = Omit<ImageProps, 'priority' | 'loading'>;

const PriorityImage = (props: PriorityImageType) => {
  return <Image {...props} priority loading="eager" />;
};

export default PriorityImage;
