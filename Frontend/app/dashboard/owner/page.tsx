'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, CalendarCheck, CreditCard, TrendingUp, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useGetAllPropertiesQuery } from '../../../redux/api/propertySlice'
import { useGetBookingsQuery } from '../../../redux/api/bookingSlice'
import { useGetAllPaymentsQuery } from '../../../redux/api/paymentSlice'

export default function OwnerDashboard() {
    const { data: propertiesData } = useGetAllPropertiesQuery({})
    const { data: bookingsData } = useGetBookingsQuery({})
    const { data: paymentsData } = useGetAllPaymentsQuery({})
    const router = useRouter()

    const stats = [
        {
            title: 'My Properties',
            value: propertiesData?.properties?.length || 0,
            icon: Home,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Total Bookings',
            value: bookingsData?.bookings?.length || 0,
            icon: CalendarCheck,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        {
            title: 'Total Payments',
            value: paymentsData?.payments?.length || 0,
            icon: CreditCard,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
    ]

    const chartData = [
        { name: 'Jan', bookings: 2 },
        { name: 'Feb', bookings: 5 },
        { name: 'Mar', bookings: 3 },
        { name: 'Apr', bookings: 8 },
        { name: 'May', bookings: 6 },
        { name: 'Jun', bookings: 10 },
    ]

    return (
        <DashboardLayout role="owner">
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your properties and bookings</p>
                    </div>
                    <Button
                        onClick={() => router.push('/dashboard/owner/properties')}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Property
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Chart */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Monthly Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Properties */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">My Recent Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {propertiesData?.properties?.slice(0, 5).map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">{p.property_name}</p>
                                        <p className="text-xs text-gray-500">{p.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-blue-600">Rs. {p.price?.toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                            )) || <p className="text-sm text-gray-500 text-center py-4">No properties yet</p>}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    )
}