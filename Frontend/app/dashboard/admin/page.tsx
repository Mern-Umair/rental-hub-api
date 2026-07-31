'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Users, Home, CalendarCheck, CreditCard, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useGetAllUsersQuery } from '../../../redux/api/authSlidce'
import { useGetAllPropertiesQuery } from '../../../redux/api/propertySlice'
import { useGetBookingsQuery } from '../../../redux/api/bookingSlice'
import { useGetAllPaymentsQuery } from '../../../redux/api/paymentSlice'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminDashboard() {
    const { data: usersData } = useGetAllUsersQuery({})
    const { data: propertiesData } = useGetAllPropertiesQuery({})
    const { data: bookingsData } = useGetBookingsQuery({})
    const { data: paymentsData } = useGetAllPaymentsQuery({})

    const stats = [
        {
            title: 'Total Users',
            value: usersData?.users?.length || 0,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Total Properties',
            value: propertiesData?.properties?.length || 0,
            icon: Home,
            color: 'text-green-600',
            bg: 'bg-green-50'
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
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
    ]

    const bookingChartData = [
        { name: 'Jan', bookings: 4 },
        { name: 'Feb', bookings: 7 },
        { name: 'Mar', bookings: 5 },
        { name: 'Apr', bookings: 10 },
        { name: 'May', bookings: 8 },
        { name: 'Jun', bookings: 12 },
    ]

    const paymentChartData = [
        { name: 'Jan', amount: 45000 },
        { name: 'Feb', amount: 70000 },
        { name: 'Mar', amount: 55000 },
        { name: 'Apr', amount: 90000 },
        { name: 'May', amount: 75000 },
        { name: 'Jun', amount: 110000 },
    ]

    const roleData = [
        { name: 'Tenants', value: 60 },
        { name: 'Owners', value: 30 },
        { name: 'Admins', value: 10 },
    ]

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>All systems running</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Bookings Chart */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Monthly Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={bookingChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue Chart */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={paymentChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Pie Chart */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">User Roles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                                        {roleData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-2">
                                {roleData.map((item, index) => (
                                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card className="border-0 shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {bookingsData?.bookings?.slice(0, 5).map((booking: any) => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">Booking #{booking.id}</p>
                                            <p className="text-xs text-gray-500">Property #{booking.property_id}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                )) || (
                                        <p className="text-sm text-gray-500 text-center py-4">No bookings yet</p>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </DashboardLayout>
    )
}