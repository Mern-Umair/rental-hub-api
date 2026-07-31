'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Home, Plus, Search, Trash2, Pencil } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAddPropertyMutation, useDeletePropertyMutation, useGetAllPropertiesQuery, useUpdatePropertyMutation } from '../../../../redux/api/propertySlice'

export default function OwnerPropertiesPage() {
    const { data, isLoading, refetch } = useGetAllPropertiesQuery({})
    const [addProperty] = useAddPropertyMutation()
    const [deleteProperty] = useDeletePropertyMutation()
    const [updateProperty] = useUpdatePropertyMutation()

    const [search, setSearch] = useState('')
    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<any>(null)

    const [form, setForm] = useState({
        property_name: '', location: '', price: '', status: 'available'
    })

    const properties = data?.properties || []
    const filtered = properties.filter((p: any) =>
        p.property_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addProperty(form).unwrap()
            toast.success('Property added successfully!')
            setShowAdd(false)
            setForm({ property_name: '', location: '', price: '', status: 'available' })
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to add property!')
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateProperty({ id: selectedProperty.id, ...form }).unwrap()
            toast.success('Property updated successfully!')
            setShowEdit(false)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update property!')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this property?')) return
        try {
            await deleteProperty(id).unwrap()
            toast.success('Property deleted successfully!')
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete property!')
        }
    }

    const openEdit = (p: any) => {
        setSelectedProperty(p)
        setForm({ property_name: p.property_name, location: p.location, price: p.price, status: p.status })
        setShowEdit(true)
    }

    return (
        <DashboardLayout role="owner">
            <div className="p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your listed properties</p>
                    </div>
                    <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Property
                    </Button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Properties ({filtered.length})</CardTitle>
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
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((p: any, index: number) => (
                                            <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                                                <td className="py-3 px-4 text-sm font-medium">{p.property_name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{p.location}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">Rs. {p.price?.toLocaleString()}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                                        {p.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add Dialog */}
                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Property</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <Input placeholder="Property Name" value={form.property_name} onChange={(e) => setForm({ ...form, property_name: e.target.value })} required />
                            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                            <Input placeholder="Price (Rs.)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="rented">Rented</option>
                            </select>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add Property</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={showEdit} onOpenChange={setShowEdit}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Property</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <Input placeholder="Property Name" value={form.property_name} onChange={(e) => setForm({ ...form, property_name: e.target.value })} required />
                            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                            <Input placeholder="Price (Rs.)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="rented">Rented</option>
                            </select>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Update Property</Button>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    )
}