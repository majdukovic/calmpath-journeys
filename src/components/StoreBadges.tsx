const AppleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 814 1000" fill="currentColor">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.7-105.8-209.5-105.8-330.3 0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.8zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.7 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.4 0 103.2-30.4 139.5-71.4z" />
  </svg>
);

const GooglePlayIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    <path d="M48 16.2C48 9.7 50.5 4.1 55.1 1L261.7 213.2 55.1 425.4C50.5 422.3 48 416.7 48 410.2V16.2Z" fill="#4285F4" />
    <path d="M340.4 234.6L293.2 213.2 55.1 1C58.1-1.1 61.8-0.3 65.8 2.3L302.5 139.2 340.4 234.6Z" fill="#34A853" />
    <path d="M340.4 234.6L302.5 287.2 65.8 424.1C61.8 426.7 58.1 427.5 55.1 425.4L293.2 213.2 340.4 234.6Z" fill="#EA4335" />
    <path d="M464 213.2C472.8 218.3 472.8 228.1 464 233.2L370.9 287.2 340.4 234.6 370.9 182.1 464 213.2Z" fill="#FBBC04" />
  </svg>
);

interface StoreBadgeProps {
  variant?: 'hero' | 'cta';
  className?: string;
}

export const AppStoreBadge = ({ variant = 'hero', className = '' }: StoreBadgeProps) => {
  const isHero = variant === 'hero';
  return (
    <a
      href={isHero ? '#download' : 'https://apps.apple.com'}
      target={isHero ? undefined : '_blank'}
      rel={isHero ? undefined : 'noopener noreferrer'}
      className={`bg-foreground text-background ${isHero ? 'px-8 py-4 rounded-2xl' : 'px-8 py-4 rounded-2xl'} font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity ${className}`}
    >
      <AppleIcon size={isHero ? 20 : 24} />
      <div className="text-left">
        <p className="text-[10px] opacity-80 leading-none">Download on the</p>
        <p className={`${isHero ? 'text-base' : 'text-lg'} font-semibold leading-tight`}>App Store</p>
      </div>
    </a>
  );
};

export const GooglePlayBadge = ({ variant = 'hero', className = '' }: StoreBadgeProps) => {
  const isHero = variant === 'hero';
  return (
    <a
      href={isHero ? '#download' : 'https://play.google.com'}
      target={isHero ? undefined : '_blank'}
      rel={isHero ? undefined : 'noopener noreferrer'}
      className={`${isHero ? 'bg-card text-foreground border border-border hover:bg-muted' : 'bg-foreground text-background hover:opacity-90'} ${isHero ? 'px-8 py-4 rounded-2xl' : 'px-8 py-4 rounded-2xl'} font-semibold flex items-center justify-center gap-3 transition-all ${className}`}
    >
      <GooglePlayIcon size={isHero ? 20 : 24} />
      <div className="text-left">
        <p className="text-[10px] opacity-80 leading-none">Get it on</p>
        <p className={`${isHero ? 'text-base' : 'text-lg'} font-semibold leading-tight`}>Google Play</p>
      </div>
    </a>
  );
};
