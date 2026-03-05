"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CURRENCIES } from '@/components/CurrencySymbol'

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria",
    "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia",
    "Finland", "France",
    "Georgia", "Germany", "Ghana", "Greece", "Guatemala",
    "Honduras", "Hong Kong", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan",
    "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
    "Macau", "Malaysia", "Maldives", "Malta", "Mexico", "Moldova", "Mongolia", "Morocco", "Myanmar",
    "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
]

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        country: '',
        currency: 'AED'
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
                        phone: formData.phone,
                        country: formData.country,
                        currency: formData.currency
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

    const selectStyle = {
        padding: "1rem 1.25rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid rgba(0,0,0,0.05)",
        background: "rgba(0,0,0,0.02)",
        color: "var(--foreground)",
        fontSize: "1rem",
        outline: "none",
        transition: "var(--transition)",
        cursor: "pointer",
        width: "100%",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1.25rem center",
        backgroundSize: "12px",
        paddingRight: "2.5rem"
    }

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "var(--background)", padding: "2rem 1rem" }} className="animate-fade-in">
            <div style={{ width: "100%", maxWidth: "450px", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", background: "transparent" }}>
                <header style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem", color: "var(--foreground)", letterSpacing: "-0.03em" }}>Create Account</h1>
                    <p style={{ opacity: 0.7, color: "var(--foreground)", fontSize: "1.1rem" }}>Join Ledgr to manage your assets and transactions.</p>
                </header>

                {errorMsg && (
                    <div style={{ padding: "1rem", background: "rgba(239, 71, 111, 0.1)", color: "var(--danger)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", textAlign: "center" }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>First Name</label>
                            <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                style={{
                                    padding: "1rem 1.25rem",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    background: "rgba(0,0,0,0.02)",
                                    color: "var(--foreground)",
                                    fontSize: "1rem",
                                    outline: "none",
                                    transition: "var(--transition)"
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>Last Name</label>
                            <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                style={{
                                    padding: "1rem 1.25rem",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    background: "rgba(0,0,0,0.02)",
                                    color: "var(--foreground)",
                                    fontSize: "1rem",
                                    outline: "none",
                                    transition: "var(--transition)"
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>Phone Number</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            style={{
                                padding: "1rem 1.25rem",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "rgba(0,0,0,0.02)",
                                color: "var(--foreground)",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "var(--transition)"
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange}
                            style={{
                                padding: "1rem 1.25rem",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "rgba(0,0,0,0.02)",
                                color: "var(--foreground)",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "var(--transition)"
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>Password</label>
                        <input required type="password" name="password" value={formData.password} onChange={handleChange} minLength={6}
                            style={{
                                padding: "1rem 1.25rem",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                background: "rgba(0,0,0,0.02)",
                                color: "var(--foreground)",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "var(--transition)"
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                        />
                    </div>

                    {/* Country & Currency Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>Country</label>
                            <select
                                required
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                style={selectStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            >
                                <option value="" disabled>Select country</option>
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(0,0,0,0.7)" }}>App Currency</label>
                            <select
                                required
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                style={selectStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            >
                                {CURRENCIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.symbol}  {c.code} — {c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{
                            marginTop: "1rem",
                            width: "100%",
                            padding: "1rem",
                            justifyContent: "center",
                            borderRadius: "var(--radius-full)",
                            background: "var(--primary)",
                            color: "#ffffff",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 14px rgba(67, 97, 238, 0.3)",
                            transition: "var(--transition)",
                            display: "flex",
                            alignItems: "center"
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.3)";
                            }
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "1rem", color: "rgba(0,0,0,0.7)", marginTop: "1rem" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>Log In</Link>
                </p>
            </div>
        </main>
    )
}
