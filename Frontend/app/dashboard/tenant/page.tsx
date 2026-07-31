'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarCheck, CreditCard, Search, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useGetBookingsQuery } from '../../../redux/api/bookingSlice'
import { useGetAllPaymentsQuery } from '../../../redux/api/paymentSlice'

export default function TenantDashboard() {
    const { data: bookingsData } = useGetBookingsQuery({})
    const { data: paymentsData } = useGetAllPaymentsQuery({})
    const router = useRouter()

    const stats = [
        {
            title: 'My Bookings',
            value: bookingsData?.bookings?.length || 0,
            icon: CalendarCheck,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'My Payments',
            value: paymentsData?.payments?.length || 0,
            icon: CreditCard,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
    ]

    return (
        <DashboardLayout role="tenant">
            <div className="p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Find your perfect property</p>
                    </div>
                    <Button onClick={() => router.push('/dashboard/tenant/search')} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search Properties
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <Card key={stat.title} className="border-0 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.bg} p-3 rounded-xl`}>
                                            <Icon className={`${stat.color} w-6 h-6`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Quick Actions */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button onClick={() => router.push('/dashboard/tenant/search')} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                                <Search className="text-blue-600 w-5 h-5" />
                                <span className="text-sm font-medium text-blue-700">Search Properties</span>
                            </button>
                            <button onClick={() => router.push('/dashboard/tenant/bookings')} className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition">
                                <CalendarCheck className="text-yellow-600 w-5 h-5" />
                                <span className="text-sm font-medium text-yellow-700">My Bookings</span>
                            </button>
                            <button onClick={() => router.push('/dashboard/tenant/chat')} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
                                <MessageSquare className="text-green-600 w-5 h-5" />
                                <span className="text-sm font-medium text-green-700">AI Assistant</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {bookingsData?.bookings?.slice(0, 5).map((b: any) => (
                                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Booking #{b.id}</p>
                                        <p className="text-xs text-gray-500">Property #{b.property_id}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {b.status}
                                    </span>
                                </div>
                            )) || <p className="text-sm text-gray-500 text-center py-4">No bookings yet</p>}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    )
}