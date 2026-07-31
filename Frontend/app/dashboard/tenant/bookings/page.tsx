'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useCancelBookingMutation, useGetBookingsQuery } from '../../../../redux/api/bookingSlice'

export default function TenantBookingsPage() {
    const { data, isLoading, refetch } = useGetBookingsQuery({})
    const [cancelBooking] = useCancelBookingMutation()
    const bookings = data?.bookings || []

    const handleCancel = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        try {
            await cancelBooking(id).unwrap()
            toast.success('Booking cancelled!')
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to cancel booking!')
        }
    }

    const statusColor = (status: string) => {
        if (status === 'confirmed') return 'bg-green-100 text-green-700'
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
        if (status === 'cancelled') return 'bg-red-100 text-red-700'
        return 'bg-gray-100 text-gray-700'
    }

    return (
        <DashboardLayout role="tenant">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-500 text-sm mt-1">View and manage your bookings</p>
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
                        ) : bookings.length === 0 ? (
                            <p className="text-center py-8 text-gray-500">No bookings yet</p>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map((b: any) => (
                                    <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium">Booking #{b.id}</p>
                                            <p className="text-xs text-gray-500">Property #{b.property_id}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(b.start_date).toLocaleDateString()} — {new Date(b.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className="text-sm font-semibold text-blue-600">Rs. {b.total_price?.toLocaleString()}</p>
                                            <Badge className={statusColor(b.status)}>{b.status}</Badge>
                                            {b.status === 'pending' && (
                                                <Button
                                                    onClick={() => handleCancel(b.id)}
                                                    variant="outline"
                                                    className="text-xs text-red-600 border-red-200 hover:bg-red-50 h-7"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}