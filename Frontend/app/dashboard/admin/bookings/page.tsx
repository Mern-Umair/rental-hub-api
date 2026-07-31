'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarCheck } from 'lucide-react'
import { useGetBookingsQuery } from '../../../../redux/api/bookingSlice'

export default function AllBookingsPage() {
    const { data, isLoading } = useGetBookingsQuery({})
    const bookings = data?.bookings || []

    const statusColor = (status: string) => {
        if (status === 'confirmed') return 'bg-green-100 text-green-700'
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
        if (status === 'cancelled') return 'bg-red-100 text-red-700'
        return 'bg-gray-100 text-gray-700'
    }

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all property bookings</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-xl">
                        <CalendarCheck className="text-yellow-600 w-6 h-6" />
                    </div>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Bookings ({bookings.length})</CardTitle>
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Booking ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Property ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tenant ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Start Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">End Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Price</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-8 text-gray-500">No bookings found</td>
                                            </tr>
                                        ) : (
                                            bookings.map((b: any, index: number) => (
                                                <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="py-3 px-4 text-sm font-medium">#{b.id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">#{b.property_id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">#{b.tenant_id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{new Date(b.start_date).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{new Date(b.end_date).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">Rs. {b.total_price?.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={statusColor(b.status)}>{b.status}</Badge>
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