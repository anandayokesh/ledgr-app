"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg(null)

        try {
            // 1. Sign up auth.users and pass metadata for the trigger
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone
                    }
                }
            })

            if (error) throw error

            router.push('/')
        } catch (error) {
            console.error('Signup error:', error)
            setErrorMsg(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container animate-fade-in" style={{ padding: "2rem", maxWidth: "450px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="glass-panel" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <header style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Create Account</h1>
                    <p style={{ opacity: 0.7 }}>Join Ledgr to manage your assets and transactions.</p>
                </header>

                {errorMsg && (
                    <div style={{ padding: "1rem", background: "rgba(239, 71, 111, 0.1)", color: "var(--danger)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem" }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.8 }}>First Name</label>
                            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.8 }}>Last Name</label>
                            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.8 }}>Phone Number</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.8 }}>Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange}
                            style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.8 }}>Password</label>
                        <input required type="password" name="password" value={formData.password} onChange={handleChange} minLength={6}
                            style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                    </div>

                    <button type="submit" className="btn" disabled={loading} style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "0.9rem", opacity: 0.8, marginTop: "0.5rem" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>Log In</Link>
                </p>
            </div>
        </main>
    )
}
