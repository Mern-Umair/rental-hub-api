'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Home, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useGetAllPropertiesQuery } from '../../../../redux/api/propertySlice'

export default function AllPropertiesPage() {
    const { data, isLoading } = useGetAllPropertiesQuery({})
    const [search, setSearch] = useState('')

    const properties = data?.properties || []

    const filtered = properties.filter((p: any) =>
        p.property_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase())
    )

    const statusColor = (status: string) => {
        if (status === 'available') return 'bg-green-100 text-green-700'
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
        return 'bg-red-100 text-red-700'
    }

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Properties</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all listed properties</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                        <Home className="text-green-600 w-6 h-6" />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Properties ({filtered.length})</CardTitle>
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Property Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Added</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-500">No properties found</td>
                                            </tr>
                                        ) : (
                                            filtered.map((p: any, index: number) => (
                                                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{p.property_name}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{p.location}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">Rs. {p.price?.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={statusColor(p.status)}>{p.status}</Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(p.created_at).toLocaleDateString()}
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