import { Home, SquareUser, UserX } from "lucide-react";

export interface INavItem {
  id: number;
  text: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export const navItems: INavItem[] = [
  {
    id: 1,
    text: "Dashboards",
    icon: <Home className="h-4 w-4" />,
    href: "/dashboard",
  },
  {
    id: 5,
    text: "Permissions",
    icon: <SquareUser className="h-4 w-4" />,
    href: "/permissions",
  },
  {
    id: 6,
    text: "Roles",
    icon: <UserX className="h-4 w-4" />,
    href: "/roles",
  },
];
