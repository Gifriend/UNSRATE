"use client"

import { type SetStateAction, useState } from "react"
import Head from "next/head"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  LogOut, Search, } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Student {
  id: number
  nama: string
  nim: string
  status: "Pending" | "Verified"
  reports: number
  avatar?: string
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, nama: "Satria Amu", nim: "2020010001", status: "Pending", reports: 2 },
    { id: 2, nama: "Mikel", nim: "2020010002", status: "Verified", reports: 0 },
    { id: 3, nama: "Mario Paat", nim: "2020010003", status: "Pending", reports: 5 },
    { id: 4, nama: "Clarissa", nim: "2020010004", status: "Verified", reports: 1 },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const handleVerify = (id: number) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, status: "Verified" } : student)))
  }

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
      setStudents(students.filter((student) => student.id !== id))
    }
  }

  const filteredStudents = students.filter(
    (student) => student.nama.toLowerCase().includes(searchQuery.toLowerCase()) || student.nim.includes(searchQuery),
  )

  const pendingStudents = filteredStudents.filter((student) => student.status === "Pending")
  const verifiedStudents = filteredStudents.filter((student) => student.status === "Verified")
  const reportedStudents = filteredStudents.filter((student) => student.reports > 0)

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard untuk manajemen mahasiswa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen">        
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <p className="text-muted-foreground">Kelola mahasiswa dan verifikasi akun</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari mahasiswa..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </Link>
                {/* <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">{pendingStudents.length} menunggu verifikasi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Terverifikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{verifiedStudents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((verifiedStudents.length / students.length) * 100)}% dari total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportedStudents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {reportedStudents.reduce((acc, student) => acc + student.reports, 0)} total laporan
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="pending">Menunggu</TabsTrigger>
                  <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
                  <TabsTrigger value="reported">Laporan</TabsTrigger>
                </TabsList>

                {/* <Button variant="outline" size="sm" className="gap-1">
                  Export <ChevronDown className="h-4 w-4" />
                </Button> */}
              </div>

              <TabsContent value="all" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium">Nama</th>
                            <th className="text-left p-4 font-medium">NIM</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Laporan</th>
                            <th className="text-right p-4 font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={student.avatar || `/placeholder.svg?height=32&width=32`}
                                      alt={student.nama}
                                    />
                                    <AvatarFallback>{student.nama[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{student.nama}</span>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">{student.nim}</td>
                              <td className="p-4">
                                <Badge variant={student.status === "Verified" ? "success" : "warning"}>
                                  {student.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {student.reports > 0 ? (
                                  <Badge variant="destructive">{student.reports} laporan</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">Tidak ada</span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {student.status !== "Verified" && (
                                    <Button onClick={() => handleVerify(student.id)} size="sm" variant="outline">
                                      Verify
                                    </Button>
                                  )}
                                  <Button onClick={() => handleDelete(student.id)} size="sm" variant="destructive">
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium">Nama</th>
                            <th className="text-left p-4 font-medium">NIM</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Laporan</th>
                            <th className="text-right p-4 font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingStudents.map((student) => (
                            <tr key={student.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={student.avatar || `/placeholder.svg?height=32&width=32`}
                                      alt={student.nama}
                                    />
                                    <AvatarFallback>{student.nama[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{student.nama}</span>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">{student.nim}</td>
                              <td className="p-4">
                                <Badge variant="warning">{student.status}</Badge>
                              </td>
                              <td className="p-4">
                                {student.reports > 0 ? (
                                  <Badge variant="destructive">{student.reports} laporan</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">Tidak ada</span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button onClick={() => handleVerify(student.id)} size="sm" variant="outline">
                                    Verify
                                  </Button>
                                  <Button onClick={() => handleDelete(student.id)} size="sm" variant="destructive">
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verified" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium">Nama</th>
                            <th className="text-left p-4 font-medium">NIM</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Laporan</th>
                            <th className="text-right p-4 font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {verifiedStudents.length > 0 ? (
                            verifiedStudents.map((student) => (
                              <tr key={student.id} className="border-b hover:bg-muted/50">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={student.avatar || `/placeholder.svg?height=32&width=32`}
                                        alt={student.nama}
                                      />
                                      <AvatarFallback>{student.nama[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{student.nama}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground">{student.nim}</td>
                                <td className="p-4">
                                  <Badge variant="success">{student.status}</Badge>
                                </td>
                                <td className="p-4">
                                  {student.reports > 0 ? (
                                    <Badge variant="destructive">{student.reports} laporan</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Tidak ada</span>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button onClick={() => handleDelete(student.id)} size="sm" variant="destructive">
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                Tidak ada mahasiswa terverifikasi
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reported" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium">Nama</th>
                            <th className="text-left p-4 font-medium">NIM</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Laporan</th>
                            <th className="text-right p-4 font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportedStudents.length > 0 ? (
                            reportedStudents.map((student) => (
                              <tr key={student.id} className="border-b hover:bg-muted/50">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={student.avatar || `/placeholder.svg?height=32&width=32`}
                                        alt={student.nama}
                                      />
                                      <AvatarFallback>{student.nama[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{student.nama}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground">{student.nim}</td>
                                <td className="p-4">
                                  <Badge variant={student.status === "Verified" ? "success" : "warning"}>
                                    {student.status}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <Badge variant="destructive" className="font-medium">
                                    {student.reports} laporan
                                  </Badge>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    {student.status !== "Verified" && (
                                      <Button onClick={() => handleVerify(student.id)} size="sm" variant="outline">
                                        Verify
                                      </Button>
                                    )}
                                    <Button onClick={() => handleDelete(student.id)} size="sm" variant="destructive">
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                Tidak ada mahasiswa dengan laporan
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
