'use client'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2, LayoutDashboard, Users, Home,
  CalendarCheck, CreditCard, MessageSquare,
  Search, LogOut, ChevronRight
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface SidebarProps {
  role: string
  user: any
}

const adminLinks = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'All Users', icon: Users },
  { href: '/dashboard/admin/properties', label: 'All Properties', icon: Home },
  { href: '/dashboard/admin/bookings', label: 'All Bookings', icon: CalendarCheck },
  { href: '/dashboard/admin/payments', label: 'All Payments', icon: CreditCard },
]

const ownerLinks = [
  { href: '/dashboard/owner', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/owner/properties', label: 'My Properties', icon: Home },
  { href: '/dashboard/owner/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/dashboard/owner/payments', label: 'Payments', icon: CreditCard },
]

const tenantLinks = [
  { href: '/dashboard/tenant', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tenant/search', label: 'Search Properties', icon: Search },
  { href: '/dashboard/tenant/bookings', label: 'My Bookings', icon: CalendarCheck },
  { href: '/dashboard/tenant/payments', label: 'My Payments', icon: CreditCard },
  { href: '/dashboard/tenant/chat', label: 'AI Assistant', icon: MessageSquare },
]

export default function Sidebar({ role, user }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const links = role === 'admin' ? adminLinks : role === 'owner' ? ownerLinks : tenantLinks

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully!')
    router.push('/login')
  }

  const roleColor = role === 'admin' ? 'bg-red-100 text-red-700' : role === 'owner' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'

  return (
    <div className="w-64 min-h-screen bg-white border-r flex flex-col">

      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">PropertyHub</h1>
            <p className="text-xs text-gray-500">AI Powered</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <Badge className={cn("text-xs mt-0.5", roleColor)}>
              {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{link.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          )
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}