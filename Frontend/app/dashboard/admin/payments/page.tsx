'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'
import { useGetAllPaymentsQuery } from '../../../../redux/api/paymentSlice'

export default function AllPaymentsPage() {
    const { data, isLoading } = useGetAllPaymentsQuery({})
    const payments = data?.payments || []

    const statusColor = (status: string) => {
        if (status === 'completed') return 'bg-green-100 text-green-700'
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
        return 'bg-red-100 text-red-700'
    }

    return (
        <DashboardLayout role="admin">
            <div className="p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all payment transactions</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl">
                        <CreditCard className="text-red-600 w-6 h-6" />
                    </div>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Payments ({payments.length})</CardTitle>
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Booking ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tenant ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Method</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-8 text-gray-500">No payments found</td>
                                            </tr>
                                        ) : (
                                            payments.map((p: any, index: number) => (
                                                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="py-3 px-4 text-sm font-medium">#{p.id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">#{p.booking_id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">#{p.tenant_id}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">Rs. {p.amount?.toLocaleString()}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{p.payment_method}</td>
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