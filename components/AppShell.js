"use client"

import { useAuth } from '@/components/AuthProvider'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

// Pages where the bottom nav should NOT show
const hideNavPaths = ['/login', '/signup']

export default function AppShell({ children }) {
    const { user } = useAuth()
    const pathname = usePathname()

    const showNav = user && !hideNavPaths.includes(pathname)

    return (
        <>
            {children}
            {showNav && <BottomNav />}
        </>
    )
}
