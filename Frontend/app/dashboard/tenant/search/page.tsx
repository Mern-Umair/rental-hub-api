'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, MapPin, DollarSign, Home } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useGetAllPropertiesQuery } from '../../../../redux/api/propertySlice'
import { useCreateBookingMutation } from '../../../../redux/api/bookingSlice'

export default function TenantSearchPage() {
    const { data, isLoading } = useGetAllPropertiesQuery({})
    const [createBooking] = useCreateBookingMutation()
    const [search, setSearch] = useState('')
    const [showBook, setShowBook] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<any>(null)
    const [form, setForm] = useState({
        start_date: '', end_date: '', total_price: ''
    })

    const properties = data?.properties || []
    const filtered = properties.filter((p: any) =>
        p.property_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase())
    )

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createBooking({
                property_id: selectedProperty.id,
                start_date: form.start_date,
                end_date: form.end_date,
                total_price: form.total_price
            }).unwrap()
            toast.success('Booking created successfully!')
            setShowBook(false)
            setForm({ start_date: '', end_date: '', total_price: '' })
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create booking!')
        }
    }

    return (
        <DashboardLayout role="tenant">
            <div className="p-6 space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Search Properties</h1>
                    <p className="text-gray-500 text-sm mt-1">Find your perfect property</p>
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

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((p: any) => (
                            <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="bg-blue-50 p-2 rounded-lg">
                                            <Home className="text-blue-600 w-5 h-5" />
                                        </div>
                                        <Badge className={p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                            {p.status}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{p.property_name}</h3>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{p.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600 font-semibold mb-4">
                                        <DollarSign className="w-3 h-3" />
                                        <span>Rs. {p.price?.toLocaleString()} / month</span>
                                    </div>
                                    {p.status === 'available' && (
                                        <Button
                                            onClick={() => { setSelectedProperty(p); setShowBook(true) }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                                        >
                                            Book Now
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No properties found
                            </div>
                        )}
                    </div>
                )}

                <Dialog open={showBook} onOpenChange={setShowBook}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Book — {selectedProperty?.property_name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">End Date</label>
                                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Total Price (Rs.)</label>
                                <Input type="number" value={form.total_price} onChange={(e) => setForm({ ...form, total_price: e.target.value })} placeholder="Enter total price" required />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Confirm Booking</Button>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    )
}