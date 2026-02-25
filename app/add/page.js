"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import { Dirham } from '@/components/Dirham'
import { ArrowLeft } from 'lucide-react'

export default function AddTransaction() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'Expense',
        category: 'Food',
        necessity: 'Need'
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    // Predefined options
    const categoriesUrl = {
        Income: ['Salary', 'Rent', 'Dividend', 'Interest', 'Gift'],
        Expense: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
    }
    const necessityOptions = ['Need', 'Want', 'Savings', 'Wasted']

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset category if type changes
            ...(name === 'type' ? { category: categoriesUrl[value][0] } : {})
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('transactions')
                .insert([
                    {
                        amount: parseFloat(formData.amount),
                        date: formData.date,
                        description: formData.description,
                        type: formData.type,
                        category: formData.category,
                        necessity: formData.necessity,
                        user_id: user.id
                    }
                ])

            if (error) throw error

            // Navigate back to dashboard and refresh
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Error inserting transaction:', error)
            alert('Failed to add transaction.')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || !user) {
        return (
            <main style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4f6fa" }}>
                <p style={{ opacity: 0.6, fontSize: "1.2rem", color: "#1a1a1a" }}>Loading...</p>
            </main>
        )
    }

    const defaultInputStyle = {
        padding: "1rem",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.05)",
        background: "rgba(0,0,0,0.02)",
        width: "100%",
        fontSize: "1rem",
        color: "#1a1a1a",
        outline: "none",
        transition: "var(--transition)"
    }

    const primaryButtonStyle = {
        padding: "1rem",
        borderRadius: "var(--radius-full)",
        background: "var(--primary)", // Purple
        color: "#ffffff",
        fontWeight: "700",
        fontSize: "1rem",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(67, 97, 238, 0.4)",
        transition: "var(--transition)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: "1rem"
    }

    return (
        <main className="animate-fade-in" style={{
            minHeight: "100vh",
            background: "#f4f6fa", // Consistent light grey bg
            color: "#1a1a1a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem 1rem"
        }}>
            <div style={{ width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column" }}>

                {/* Header matching details page */}
                <header style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>
                    <Link href="/" style={{
                        padding: "0.5rem",
                        borderRadius: "50%",
                        background: "transparent",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#1a1a1a",
                        marginLeft: "-0.5rem"
                    }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#1a1a1a", letterSpacing: "-0.5px" }}>Add Transaction</h1>
                </header>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {/* Type selector pill (matching image) */}
                    <div style={{
                        display: "flex",
                        background: "rgba(0,0,0,0.03)",
                        borderRadius: "var(--radius-full)",
                        padding: "0.25rem",
                        marginBottom: "0.5rem"
                    }}>
                        <button type="button" onClick={() => handleChange({ target: { name: 'type', value: 'Income' } })}
                            style={{
                                flex: 1,
                                padding: "0.75rem",
                                borderRadius: "var(--radius-full)",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                transition: "var(--transition)",
                                background: formData.type === 'Income' ? '#ffffff' : 'transparent',
                                boxShadow: formData.type === 'Income' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                color: formData.type === 'Income' ? '#1a1a1a' : 'rgba(0,0,0,0.5)' // Image shows black text for unselected/selected income, wait, image shows Red for expense
                            }}>
                            Income
                        </button>
                        <button type="button" onClick={() => handleChange({ target: { name: 'type', value: 'Expense' } })}
                            style={{
                                flex: 1,
                                padding: "0.75rem",
                                borderRadius: "var(--radius-full)",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                transition: "var(--transition)",
                                background: formData.type === 'Expense' ? '#ffffff' : 'transparent',
                                boxShadow: formData.type === 'Expense' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                color: formData.type === 'Expense' ? 'var(--danger)' : 'rgba(0,0,0,0.5)'
                            }}>
                            Expense
                        </button>
                    </div>

                    {/* Amount */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: "600", color: "rgba(0,0,0,0.7)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            Amount (<Dirham />)
                        </label>
                        <input
                            required
                            type="number"
                            name="amount"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            style={{
                                ...defaultInputStyle,
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "rgba(0,0,0,0.6)",
                                padding: "1.2rem 1.5rem"
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                        />
                    </div>

                    {/* Date & Description Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: "600", color: "rgba(0,0,0,0.7)", fontSize: "0.95rem" }}>Date</label>
                            <input
                                required
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                style={defaultInputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: "600", color: "rgba(0,0,0,0.7)", fontSize: "0.95rem" }}>Description</label>
                            <input
                                required
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g. Groceries"
                                style={defaultInputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            />
                        </div>
                    </div>

                    {/* Category/Source Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: "600", color: "rgba(0,0,0,0.7)", fontSize: "0.95rem" }}>
                                {formData.type === 'Income' ? 'Source' : 'Category'}
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{ ...defaultInputStyle, cursor: "pointer" }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            >
                                {categoriesUrl[formData.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        {/* Hide Intent when Income as requested */}
                        {formData.type === 'Expense' ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: "600", color: "rgba(0,0,0,0.7)", fontSize: "0.95rem" }}>Intent</label>
                                <select
                                    name="necessity"
                                    value={formData.necessity}
                                    onChange={handleChange}
                                    style={{ ...defaultInputStyle, cursor: "pointer" }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#fff"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                >
                                    {necessityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div /> // Empty placeholder to maintain grid layout
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={primaryButtonStyle}
                        disabled={loading}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.5)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.4)";
                            }
                        }}
                    >
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </button>

                </form>
            </div>
        </main>
    )
}
