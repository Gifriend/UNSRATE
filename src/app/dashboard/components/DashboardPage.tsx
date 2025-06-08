// app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { User, Stats, PageInfo } from '@/app/types/adminTypes';
import { DashboardHeader } from './DashboardHeader';
import { StatCards } from './StatCards';
import { DashboardTabs } from './DashboardTabs';
import DashboardSkeleton from './DashboardSekeleton';

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('admin/dashboard/stats');
      setStats(statsRes.data);
      const usersRes = await api.get(
        `admin/users?page=${pageInfo.currentPage}&limit=${pageInfo.limit}`
      );
      const usersData = usersRes.data;
      setUsers(usersData.users);
      setPageInfo(usersData.pageInfo);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [pageInfo.currentPage, pageInfo.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerify = async (id: string) => {
    try {
      await api.patch(`admin/users/${id}/verify`);
      fetchData();
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) {
      try {
        await api.delete(`admin/users/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = 'refresh_token=; Max-Age=0; path=/';
    document.cookie = 'role=; Max-Age=0; path=/';
    router.push('/auth');
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.nim && user.nim.includes(searchQuery))
  );

  const pendingUsers = filteredUsers.filter((user) => !user.verified);
  const verifiedUsers = filteredUsers.filter((user) => user.verified);
  const reportedUsers = filteredUsers.filter((user) => user.reportCount > 0);

  const handlePageChange = (newPage: number) => {
    setPageInfo((prev) => ({ ...prev, currentPage: newPage }));
  };

  
  if (loading) {
    return <DashboardSkeleton />; 
  }

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Admin Dashboard</title>
        <meta
          name="description"
          content="Admin Dashboard untuk manajemen mahasiswa"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen">
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <DashboardHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleLogout={handleLogout}
            />

            <StatCards
              stats={stats}
              pendingUsersCount={pendingUsers.length}
              reportedUsersTotalReports={reportedUsers.reduce(
                (acc, user) => acc + user.reportCount,
                0
              )}
            />

            <DashboardTabs
              users={users}
              pageInfo={pageInfo}
              onPageChange={handlePageChange}
              onVerify={handleVerify}
              onDelete={handleDelete}
              filteredUsers={filteredUsers}
              pendingUsers={pendingUsers}
              verifiedUsers={verifiedUsers}
              reportedUsers={reportedUsers}
            />
          </div>
        </main>
      </div>
    </div>
  );
}