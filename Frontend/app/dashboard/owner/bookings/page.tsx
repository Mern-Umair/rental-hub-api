'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useGetBookingsQuery, useUpdateBookingStatusMutation } from '../../../../redux/api/bookingSlice'

export default function OwnerBookingsPage() {
    const { data, isLoading, refetch } = useGetBookingsQuery({})
    const [updateStatus] = useUpdateBookingStatusMutation()
    const bookings = data?.bookings || []

    const handleStatus = async (id: number, status: string) => {
        try {
            await updateStatus({ id, status }).unwrap()
            toast.success('Booking status updated!')
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update status!')
        }
    }

    const statusColor = (status: string) => {
        if (status === 'confirmed') return 'bg-green-100 text-green-700'
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
        if (status === 'cancelled') return 'bg-red-100 text-red-700'
        return 'bg-gray-100 text-gray-700'
    }

    return (
        <DashboardLayout role="owner">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage property bookings</p>
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Property ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tenant ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Start Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">End Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((b: any, index: number) => (
                                            <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                <td className="py-3 px-4 text-sm">#{b.property_id}</td>
                                                <td className="py-3 px-4 text-sm">#{b.tenant_id}</td>
                                                <td className="py-3 px-4 text-sm">{new Date(b.start_date).toLocaleDateString()}</td>
                                                <td className="py-3 px-4 text-sm">{new Date(b.end_date).toLocaleDateString()}</td>
                                                <td className="py-3 px-4 text-sm">Rs. {b.total_price?.toLocaleString()}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={statusColor(b.status)}>{b.status}</Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={b.status}
                                                        onChange={(e) => handleStatus(b.id, e.target.value)}
                                                        className="text-xs border rounded px-2 py-1"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
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