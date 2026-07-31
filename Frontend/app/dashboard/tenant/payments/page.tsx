'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CreditCard, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCreatePaymentMutation, useGetAllPaymentsQuery } from '../../../../redux/api/paymentSlice'

export default function TenantPaymentsPage() {
    const { data, isLoading, refetch } = useGetAllPaymentsQuery({})
    const [createPayment] = useCreatePaymentMutation()
    const [showAdd, setShowAdd] = useState(false)
    const [form, setForm] = useState({ booking_id: '', amount: '', payment_method: 'cash' })
    const payments = data?.payments || []

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createPayment(form).unwrap()
            toast.success('Payment created successfully!')
            setShowAdd(false)
            setForm({ booking_id: '', amount: '', payment_method: 'cash' })
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create payment!')
        }
    }

    return (
        <DashboardLayout role="tenant">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>
                        <p className="text-gray-500 text-sm mt-1">View payment history</p>
                    </div>
                    <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Make Payment
                    </Button>
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
                        ) : payments.length === 0 ? (
                            <p className="text-center py-8 text-gray-500">No payments yet</p>
                        ) : (
                            <div className="space-y-3">
                                {payments.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium">Payment #{p.id}</p>
                                            <p className="text-xs text-gray-500">Booking #{p.booking_id}</p>
                                            <p className="text-xs text-gray-500">{p.payment_method}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className="text-sm font-semibold text-blue-600">Rs. {p.amount?.toLocaleString()}</p>
                                            <Badge className={p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                                                {p.status}
                                            </Badge>
                                            <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Make Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <Input placeholder="Booking ID" type="number" value={form.booking_id} onChange={(e) => setForm({ ...form, booking_id: e.target.value })} required />
                            <Input placeholder="Amount (Rs.)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                            <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Submit Payment</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}