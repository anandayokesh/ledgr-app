"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'

export default function Profile() {
    const { user, profile, loading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading])

    if (authLoading) {
        return (
            <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-dark)", color: "var(--fg-dark)" }}>
                <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Loading...</p>
            </main>
        )
    }

    return (
        <main className="animate-fade-in" style={{ minHeight: "100vh", background: "var(--bg-dark)", color: "var(--fg-dark)", display: "flex", flexDirection: "column", alignItems: "center" }}>

            <header style={{ padding: "2rem 1.5rem 1rem", width: "100%", textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--border)", overflow: "hidden", margin: "0 auto 1rem", border: "3px solid var(--primary)" }}>
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9" alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>{profile?.first_name || 'User'}</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginTop: "0.25rem" }}>{user?.email}</p>
            </header>

            <div style={{ padding: "2rem 1.5rem", width: "100%", maxWidth: "450px", paddingBottom: "6rem" }}>
                <button
                    onClick={async () => {
                        await supabase.auth.signOut()
                        router.push('/')
                    }}
                    style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(239, 71, 111, 0.1)",
                        border: "none",
                        color: "var(--danger)",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "var(--transition)"
                    }}
                >
                    Log Out
                </button>
            </div>

        </main>
    )
}
