import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.25" />
    </Icon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </Icon>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Icon>
  );
}

export function IconPackage(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16.5 9.4 7.5 4.2" />
      <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </Icon>
  );
}

export function IconBento(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 5v14" />
    </Icon>
  );
}

export function IconSushi(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="12" rx="8" ry="5" />
      <path d="M4 12c1.5 1.5 4.5 2.5 8 2.5s6.5-1 8-2.5" />
      <circle cx="10" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11.5" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconClamshell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M4 14h16" />
      <path d="M6 14v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" />
    </Icon>
  );
}

export function IconTray(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5V8" />
    </Icon>
  );
}

export function IconCup(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h8l-1 12a3 3 0 0 1-3 2.7A3 3 0 0 1 9 16L8 4z" />
      <path d="M16 7h2.5a2.5 2.5 0 0 1 0 5H15" />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </Icon>
  );
}

export function IconList(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconFactory(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 20h20" />
      <path d="M4 20V10l5 4V10l5 4V6h6v14" />
    </Icon>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M1 16h14V6H1z" />
      <path d="M15 10h4l3 3v3h-7" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </Icon>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3 5 6v5c0 5 3.2 8.4 7 9.5 3.8-1.1 7-4.5 7-9.5V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

export function IconHandshake(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m8 13 2.5 2.5a2 2 0 0 0 2.8 0L18 11" />
      <path d="M14 9.5 11.5 7a2 2 0 0 0-2.8 0L4 11.7" />
      <path d="M18 11v6" />
      <path d="M4 12v5" />
      <path d="M20 8v2" />
    </Icon>
  );
}

export function IconLeaf(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 19c8 0 12-6 12-14-6 0-12 4-12 14z" />
      <path d="M5 19c2-4 6-7 11-8" />
    </Icon>
  );
}

export function IconLightbulb(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.8c.5.4.9 1 .9 1.7V17h5.2v-1.5c0-.7.4-1.3.9-1.7A6 6 0 0 0 12 3z" />
    </Icon>
  );
}

export function IconMap(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
      <path d="M9 4v13" />
      <path d="M15 7v13" />
    </Icon>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" />
    </Icon>
  );
}

export function IconMessenger(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2z" />
      <path d="m7.5 13.5 2.8-3 2.2 2 3.5-3-2.8 3-2.2-2-3.5 3z" />
    </Icon>
  );
}

export function IconShopee(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9h12l-1 11H7L6 9z" />
      <path d="M9 9a3 3 0 0 1 6 0" />
      <path d="M9 13h6" />
    </Icon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}
