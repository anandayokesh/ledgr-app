"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddTransaction() {
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

    // Predefined options
    const categoriesUrl = {
        Income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
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
                        necessity: formData.necessity
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

    return (
        <main className="container animate-fade-in" style={{ padding: "2rem", maxWidth: "600px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", color: "var(--foreground)", opacity: 0.7, marginBottom: "1rem" }}>
                    <span style={{ marginRight: "0.5rem" }}>←</span> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>Add Transaction</h1>
            </header>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Type selector */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", background: "var(--background)", padding: "0.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    <button type="button" onClick={() => handleChange({ target: { name: 'type', value: 'Income' } })}
                        style={{
                            padding: "0.5rem", borderRadius: "calc(var(--radius-md) - 0.25rem)", border: "none", cursor: "pointer", fontWeight: "600", transition: "var(--transition)",
                            background: formData.type === 'Income' ? 'var(--surface)' : 'transparent',
                            boxShadow: formData.type === 'Income' ? 'var(--shadow-sm)' : 'none',
                            color: formData.type === 'Income' ? 'var(--success)' : 'inherit'
                        }}>Income</button>

                    <button type="button" onClick={() => handleChange({ target: { name: 'type', value: 'Expense' } })}
                        style={{
                            padding: "0.5rem", borderRadius: "calc(var(--radius-md) - 0.25rem)", border: "none", cursor: "pointer", fontWeight: "600", transition: "var(--transition)",
                            background: formData.type === 'Expense' ? 'var(--surface)' : 'transparent',
                            boxShadow: formData.type === 'Expense' ? 'var(--shadow-sm)' : 'none',
                            color: formData.type === 'Expense' ? 'var(--danger)' : 'inherit'
                        }}>Expense</button>
                </div>

                {/* Amount */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: "500", opacity: 0.8, fontSize: "0.9rem" }}>Amount (₹ or $)</label>
                    <input required type="number" name="amount" step="0.01" min="0" value={formData.amount} onChange={handleChange}
                        placeholder="0.00"
                        style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: "600" }}
                    />
                </div>

                {/* Date & Description Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: "500", opacity: 0.8, fontSize: "0.9rem" }}>Date</label>
                        <input required type="date" name="date" value={formData.date} onChange={handleChange}
                            style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: "500", opacity: 0.8, fontSize: "0.9rem" }}>Description</label>
                        <input required type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g. Groceries at Walmart"
                            style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
                        />
                    </div>
                </div>

                {/* Category & Necessity Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: "500", opacity: 0.8, fontSize: "0.9rem" }}>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}
                            style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }}
                        >
                            {categoriesUrl[formData.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: "500", opacity: 0.8, fontSize: "0.9rem" }}>Necessity</label>
                        <select name="necessity" value={formData.necessity} onChange={handleChange}
                            style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }}
                        >
                            {necessityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn" disabled={loading} style={{ marginTop: "1rem" }}>
                    {loading ? 'Adding Transaction...' : 'Add Transaction'}
                </button>

            </form>
        </main>
    )
}
