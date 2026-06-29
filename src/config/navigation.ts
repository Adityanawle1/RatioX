export interface NavLink {
  label: string;
  href: string;
}

export const MAIN_NAVIGATION: NavLink[] = [
  { label: "Fee Audit", href: "/#fee-calculator" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "Learn", href: "/learn-drift" },
  { label: "About", href: "/about" },
];
