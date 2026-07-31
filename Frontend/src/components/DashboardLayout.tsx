'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'


interface DashboardLayoutProps {
    children: React.ReactNode
    role: string
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            router.push('/login')
            return
        }

        const parsedUser = JSON.parse(userData)

        if (parsedUser.role !== role) {
            router.push('/login')
            return
        }

        setUser(parsedUser)
    }, [])

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar role={role} user={user} />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}