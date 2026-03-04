"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, Clock, User } from 'lucide-react'

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/add', icon: Plus, label: 'Add' },
    { href: '/history', icon: Clock, label: 'History' },
    { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="bottom-nav">
            {/* Animated background bubble */}
            <div className="bottom-nav-inner">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="bottom-nav-icon-wrapper">
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="bottom-nav-label">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
