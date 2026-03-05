"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { CURRENCIES, getCurrencySymbol } from '@/components/CurrencySymbol'
import { Phone, Mail, Globe, Coins, Check, LogOut, MapPin } from 'lucide-react'

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

export default function Profile() {
    const { user, profile, loading: authLoading, refreshProfile } = useAuth()
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const [country, setCountry] = useState('')
    const [currency, setCurrency] = useState('AED')

    useEffect(() => {
        if (profile) {
            setCountry(profile.country || user?.user_metadata?.country || '')
            setCurrency(profile.currency || user?.user_metadata?.currency || 'AED')
        } else if (user) {
            setCountry(user.user_metadata?.country || '')
            setCurrency(user.user_metadata?.currency || 'AED')
        }
    }, [profile, user])

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading])

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ country, currency })
                .eq('id', user.id)

            if (profileError) throw profileError

            await supabase.auth.updateUser({
                data: { country, currency }
            })

            await refreshProfile()
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to save settings.')
        } finally {
            setSaving(false)
        }
    }

    if (authLoading) {
        return (
            <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4f6fa" }}>
                <p style={{ opacity: 0.6, fontSize: "1.2rem", color: "#1a1a1a" }}>Loading...</p>
            </main>
        )
    }

    const phone = profile?.phone || user?.user_metadata?.phone || '—'
    const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User'
    const displayCountry = country || profile?.country || user?.user_metadata?.country || '—'
    const currentCurrency = profile?.currency || user?.user_metadata?.currency || 'AED'

    const hasChanges = country !== (profile?.country || user?.user_metadata?.country || '') ||
        currency !== (profile?.currency || user?.user_metadata?.currency || 'AED')

    const selectStyle = {
        padding: "0.85rem 1rem",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#f8f9fb",
        color: "#1a1a1a",
        fontSize: "0.95rem",
        outline: "none",
        transition: "var(--transition)",
        cursor: "pointer",
        width: "100%",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        backgroundSize: "12px",
        paddingRight: "2.5rem"
    }

    return (
        <main className="animate-fade-in" style={{ minHeight: "100vh", background: "#f4f6fa", display: "flex", flexDirection: "column" }}>

            {/* ─── Purple Header ─── */}
            <div style={{
                background: "var(--primary)",
                padding: "2rem 1.5rem 4rem",
                position: "relative",
                borderBottomLeftRadius: "32px",
                borderBottomRightRadius: "32px",
                boxShadow: "0 8px 30px rgba(67, 97, 238, 0.35)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#fff" }}>My Profile</h2>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut()
                            router.push('/')
                        }}
                        style={{
                            background: "rgba(255,255,255,0.15)",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "var(--transition)"
                        }}
                        title="Log Out"
                    >
                        <LogOut size={18} color="#fff" />
                    </button>
                </div>
            </div>

            {/* ─── Profile Card (overlapping header) ─── */}
            <div style={{ padding: "0 1.5rem", marginTop: "-3rem", position: "relative", zIndex: 10 }}>
                <div style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    padding: "2.5rem 1.5rem 1.5rem",
                    textAlign: "center",
                    position: "relative"
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        border: "4px solid #fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                        position: "absolute",
                        top: "-40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#f1f5f9"
                    }}>
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9" alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <h1 style={{ fontSize: "1.35rem", fontWeight: "700", color: "#1a1a1a", marginTop: "0.5rem" }}>Hello {profile?.first_name || 'User'}!</h1>
                    <p style={{ color: "rgba(0,0,0,0.45)", fontSize: "0.9rem", marginTop: "0.15rem" }}>Ledgr Member</p>

                    {/* Quick Info Row */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <MapPin size={14} color="var(--primary)" />
                            <span style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.6)" }}>{displayCountry}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Phone size={14} color="var(--primary)" />
                            <span style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.6)" }}>{phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Details Section ─── */}
            <div style={{ padding: "1.5rem", maxWidth: "450px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem", paddingBottom: "6rem" }}>

                {/* Phone Number */}
                <div>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.6rem", letterSpacing: "0.02em" }}>Phone Number</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#fff", borderRadius: "14px", padding: "0.9rem 1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Phone size={18} color="var(--primary)" />
                        <span style={{ fontSize: "0.95rem", color: "#1a1a1a" }}>{phone}</span>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.6rem", letterSpacing: "0.02em" }}>Email Address</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#fff", borderRadius: "14px", padding: "0.9rem 1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Mail size={18} color="var(--primary)" />
                        <span style={{ fontSize: "0.95rem", color: "#1a1a1a" }}>{user?.email}</span>
                    </div>
                </div>

                {/* Country (editable) */}
                <div>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.6rem", letterSpacing: "0.02em" }}>Country</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#fff", borderRadius: "14px", padding: "0.9rem 1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Globe size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ ...selectStyle, border: "none", background: "transparent", padding: "0", paddingRight: "2rem", backgroundPosition: "right 0 center" }}
                            onFocus={(e) => { e.currentTarget.style.color = "var(--primary)"; }}
                            onBlur={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
                        >
                            <option value="" disabled>Select country</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* App Currency (editable) */}
                <div>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.6rem", letterSpacing: "0.02em" }}>App Currency</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#fff", borderRadius: "14px", padding: "0.9rem 1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <Coins size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ ...selectStyle, border: "none", background: "transparent", padding: "0", paddingRight: "2rem", backgroundPosition: "right 0 center" }}
                            onFocus={(e) => { e.currentTarget.style.color = "var(--primary)"; }}
                            onBlur={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
                        >
                            {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.symbol}  {c.code} — {c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Save Button */}
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            width: "100%",
                            padding: "1rem",
                            borderRadius: "var(--radius-full)",
                            background: "var(--primary)",
                            border: "none",
                            color: "#ffffff",
                            fontWeight: "700",
                            fontSize: "1rem",
                            cursor: saving ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 14px rgba(67, 97, 238, 0.3)",
                            transition: "var(--transition)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            marginTop: "0.25rem"
                        }}
                        onMouseEnter={(e) => {
                            if (!saving) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.5)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!saving) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.3)";
                            }
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}

                {/* Saved confirmation */}
                {saved && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(45, 179, 91, 0.1)",
                        color: "#2db35b",
                        fontWeight: "600",
                        fontSize: "0.9rem"
                    }}>
                        <Check size={16} /> Settings saved!
                    </div>
                )}

                {/* Log Out */}
                <button
                    onClick={async () => {
                        await supabase.auth.signOut()
                        router.push('/')
                    }}
                    style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(239, 71, 111, 0.08)",
                        border: "none",
                        color: "var(--danger)",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "var(--transition)",
                        marginTop: "0.5rem"
                    }}
                >
                    Log Out
                </button>
            </div>

        </main>
    )
}
