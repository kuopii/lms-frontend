import Image, { ImageProps } from 'next/image';

type LazyImageType = Omit<ImageProps, 'priority' | 'loading'>;

const LazyImage = (props: LazyImageType) => {
  return <Image {...props} loading="lazy" />;
};

export default LazyImage;
