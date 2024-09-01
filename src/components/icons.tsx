import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Command,
  HelpCircle,
  Laptop,
  LayoutDashboardIcon,
  Loader2,
  LogIn,
  type LucideIcon,
  type LucideProps,
  Moon,
  MoreVertical,
  NotebookPen,
  Package,
  PackageSearch,
  PenBoxIcon,
  PencilLine,
  Pizza,
  Plus,
  Search,
  Send,
  ShoppingCart,
  SunMedium,
  Trash,
  TruckIcon,
  User,
  User2,
  User2Icon,
  X
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  dashboard: LayoutDashboardIcon,
  inventory: Package,
  logo: Command,
  login: LogIn,
  close: X,
  profile: User2Icon,
  spinner: Loader2,
  ellipsis: MoreVertical,
  adjust: PackageSearch,
  add: Plus,
  edit: PencilLine,
  delete: Trash,
  warning: AlertTriangle,
  user: User2,
  truck: TruckIcon,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  order: ShoppingCart,
  send: Send,
  search: Search,
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path>
    </svg>
  ),

  check: Check
};
