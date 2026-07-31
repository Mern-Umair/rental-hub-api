'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'
import { useGetAllPaymentsQuery } from '../../../../redux/api/paymentSlice'

export default function OwnerPaymentsPage() {
    const { data, isLoading } = useGetAllPaymentsQuery({})
    const payments = data?.payments || []

    return (
        <DashboardLayout role="owner">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                        <p className="text-gray-500 text-sm mt-1">View payment history</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                        <CreditCard className="text-green-600 w-6 h-6" />
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Method</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((p: any, index: number) => (
                                            <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                <td className="py-3 px-4 text-sm font-medium">#{p.id}</td>
                                                <td className="py-3 px-4 text-sm">#{p.booking_id}</td>
                                                <td className="py-3 px-4 text-sm">Rs. {p.amount?.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-sm">{p.payment_method}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                                                        {p.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
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