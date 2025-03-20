"use client"
import { useState } from 'react';
import Head from 'next/head';

interface Student {
  id: number;
  nama: string;
  nim: string;
  status: 'Pending' | 'Verified';
  reports: number;
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, nama: "Satria Amu", nim: "2020010001", status: "Pending", reports: 2 },
    { id: 2, nama: "Mikel", nim: "2020010002", status: "Verified", reports: 0 },
    { id: 3, nama: "Mario Paat", nim: "2020010003", status: "Pending", reports: 5 },
    { id: 4, nama: "Clarissa", nim: "2020010004", status: "Verified", reports: 1 },
  ]);

  const handleVerify = (id: number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: "Verified" } : student
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard untuk manajemen mahasiswa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            <div className="flex space-x-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">NIM</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Laporan</th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{student.nama}</td>
                    <td className="py-3 px-4 text-black">{student.nim}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'Verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {student.reports > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          {student.reports} laporan
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          Tidak ada
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {student.status !== 'Verified' && (
                          <button
                            onClick={() => handleVerify(student.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}