import Link from 'next/link';

// navLinks
export const navLinks = {
  pages: {
    homepage: '/',
    features: '/features',
    profile: '/profile',
  },
  company: {
    aboutus: '/about',
    term: '/terms',
    blog: '/blog',
  },
} as const;

type NavItemsProps = {
  title: string;
  sectionKey: keyof typeof navLinks; // agar bisa mapping url
  items: Record<string, string>;
};

const NavItems = ({ title, sectionKey, items }: NavItemsProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <h4 className="text-secondary text-[28px] font-semibold">{title}</h4>
      <div className="flex flex-col gap-[10px]">
        {Object.entries(items).map(([key, label]) => {
          const href = navLinks?.[sectionKey]?.[key as keyof (typeof navLinks)[typeof sectionKey]];
          return href ? (
            <div key={key} className="flex flex-col">
              <Link href={href}>{label}</Link>
            </div>
          ) : (
            <p key={key} className="text-sm text-muted-foreground">
              {label}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default NavItems;
