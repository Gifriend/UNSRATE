// types/index.ts
export interface User {
  id: string;
  fullname: string;
  nim: string;
  email: string;
  verified: boolean;
  profilePicture: string | null;
  fakultas: string | null;
  prodi: string | null;
  createdAt: string;
  reportCount: number;
}

export interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  verificationRate: number;
}

export interface PageInfo {
  currentPage: number;
  limit: number;
  totalPages: number;
}

// Props untuk komponen DashboardHeader
export interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleLogout: () => void;
}

// Props untuk komponen StatCards
export interface StatCardsProps {
  stats: Stats | null;
  pendingUsersCount: number;
  reportedUsersTotalReports: number;
}

// Props untuk komponen UserTable
export interface UserTableProps {
  users: User[];
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  showVerifyButton?: boolean;
}

// Props untuk komponen Pagination
export interface PaginationProps {
  pageInfo: PageInfo;
  onPageChange: (newPage: number) => void;
}

// Props untuk komponen DashboardTabs
export interface DashboardTabsProps {
  users: User[];
  pageInfo: PageInfo;
  onPageChange: (newPage: number) => void;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
  filteredUsers: User[];
  pendingUsers: User[];
  verifiedUsers: User[];
  reportedUsers: User[];
}