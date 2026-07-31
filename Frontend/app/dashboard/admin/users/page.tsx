'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useGetAllUsersQuery } from '../../../../redux/api/authSlidce'

export default function AllUsersPage() {
    const { data, isLoading } = useGetAllUsersQuery({})
    const [search, setSearch] = useState('')

    const users = data?.users || []

    const filtered = users.filter((user: any) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const roleColor = (role: string) => {
        if (role === 'admin') return 'bg-red-100 text-red-700'
        if (role === 'owner') return 'bg-blue-100 text-blue-700'
        return 'bg-green-100 text-green-700'
    }

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all registered users</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <Users className="text-blue-600 w-6 h-6" />
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Users Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Users ({filtered.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((user: any, index: number) => (
                                                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                                                {user.name?.charAt(0)?.toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{user.phone || '—'}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={roleColor(user.role)}>
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    )
}