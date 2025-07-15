import { useLocale } from 'next-intl';
import LazyImage from '../imageReusable/base/LazyImage';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const locale = useLocale();

  console.log('locale??', locale);

  return (
    <div className="flex items-center gap-2">
      {locale === 'en' ? (
        <div className="relative w-[30px] h-[30px]">
          <LazyImage src={'/home/us.png'} alt="english" sizes="30px" fill className="object-contain" />
        </div>
      ) : (
        <div className="relative w-[30px] h-[30px]">
          <LazyImage src={'/home/vietnam.svg'} alt="english" sizes="30px" fill className="object-contain" />
        </div>
      )}
      <LocaleSwitcherSelect defaultValue={locale} label="Select Language" />
    </div>
  );
}
