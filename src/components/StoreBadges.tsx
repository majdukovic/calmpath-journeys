import appStoreBadge from '@/assets/badge-app-store.svg';
import googlePlayBadge from '@/assets/badge-google-play.svg';

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
      className={`inline-block hover:opacity-80 transition-opacity ${className}`}
    >
      <img
        src={appStoreBadge}
        alt="Download on the App Store"
        className={isHero ? 'h-[52px]' : 'h-[56px]'}
      />
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
      className={`inline-block hover:opacity-80 transition-opacity ${className}`}
    >
      <img
        src={googlePlayBadge}
        alt="Get it on Google Play"
        className={isHero ? 'h-[52px]' : 'h-[56px]'}
      />
    </a>
  );
};
