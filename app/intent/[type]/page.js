"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CurrencySymbol } from '@/components/CurrencySymbol'

const labelMap = {
    Need: 'Needs',
    Want: 'Wants',
    Savings: 'Savings',
    Wasted: 'Waste',
    Income: 'Income',
    Expense: 'Expense'
}

// These filter by transaction type instead of necessity
const typeFilters = ['Income', 'Expense']

export default function IntentTransactions() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const type = decodeURIComponent(params.type) // e.g. "Need", "Want", "Savings", "Wasted"

    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        } else if (user) {
            fetchTransactions()
        }
    }, [user, authLoading])

    const isTypeFilter = typeFilters.includes(type)

    async function fetchTransactions() {
        try {
            let query = supabase
                .from('transactions')
                .select('*')

            if (isTypeFilter) {
                query = query.eq('type', type)
            } else {
                query = query.eq('type', 'Expense').eq('necessity', type)
            }

            const { data, error } = await query.order('date', { ascending: false })

            if (error) throw error
            if (data) setTransactions(data)
        } catch (error) {
            console.error('Error fetching intent transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const title = labelMap[type] || type

    if (authLoading || loading) {
        return (
            <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-dark)", color: "var(--fg-dark)" }}>
                <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Loading...</p>
            </main>
        )
    }

    return (
        <main className="animate-fade-in" style={{ minHeight: "100vh", background: "var(--bg-dark)", color: "var(--fg-dark)", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <header style={{ display: "flex", alignItems: "center", padding: "1.5rem", gap: "1rem" }}>
                <Link href="/" style={{ padding: "0.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-dark)", textDecoration: "none" }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>{title} Transactions</h1>
            </header>

            {/* Transactions List */}
            <div style={{ padding: "0 1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {transactions.length === 0 ? (
                    <p style={{ textAlign: "center", opacity: 0.5, padding: "2rem 0" }}>No {title.toLowerCase()} transactions found.</p>
                ) : (
                    transactions.map((t) => (
                        <Link href={`/transaction/${t.id}`} key={t.id} style={{
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "var(--radius-lg)",
                            padding: "1rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "inherit",
                            transition: "var(--transition)"
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ color: t.type === 'Income' ? 'var(--success)' : 'var(--primary)', fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.1rem" }}>{t.type === 'Income' ? '+' : '-'}<CurrencySymbol /></div>
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: "500", fontSize: "1rem" }}>{t.description}</h4>
                                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                                        {new Date(t.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p style={{ fontWeight: "500", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                {t.type === 'Income' ? '+' : '-'}<CurrencySymbol /> {Number(t.amount).toFixed(2)}
                            </p>
                        </Link>
                    ))
                )}
            </div>

        </main>
    )
}
