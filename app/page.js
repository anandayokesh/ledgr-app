"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        throw error
      }
      if (data != null) {
        setTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Calculate stats
  const totalBalance = transactions.reduce((acc, curr) =>
    curr.type === 'Income' ? acc + Number(curr.amount) : acc - Number(curr.amount), 0
  )
  const totalIncome = transactions.reduce((acc, curr) =>
    curr.type === 'Income' ? acc + Number(curr.amount) : acc, 0
  )
  const totalExpense = transactions.reduce((acc, curr) =>
    curr.type === 'Expense' ? acc + Number(curr.amount) : acc, 0
  )

  if (authLoading) {
    return (
      <main className="container animate-fade-in" style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Loading...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="container animate-fade-in" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "800", letterSpacing: "-0.04em", marginBottom: "1rem", background: "linear-gradient(to right, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ledgr</h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.7, maxWidth: "500px", marginBottom: "3rem" }}>
          Premium transaction tracking to easily manage your assets and liabilities, secure and fully personal.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login" className="btn" style={{ background: "transparent", color: "var(--foreground)", border: "1px solid var(--border)" }}>
            Log In
          </Link>
          <Link href="/signup" className="btn">
            Sign Up
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container animate-fade-in" style={{ padding: "2rem", maxWidth: "1000px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
            Ledgr
            {profile?.first_name && <span style={{ opacity: 0.5, marginLeft: "0.5rem" }}>for {profile.first_name}</span>}
          </h1>
          <p style={{ color: "var(--foreground)", opacity: 0.7 }}>Dashboard</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={handleSignOut} style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>
            Sign Out
          </button>
          <Link href="/add" className="btn" style={{ borderRadius: "var(--radius-md)" }}>
            <span style={{ marginRight: "0.5rem" }}>+</span> Add Transaction
          </Link>
        </div>
      </header>

      {/* Summary Cards */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "0.5rem" }}>Total Balance</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: totalBalance >= 0 ? "var(--success)" : "var(--danger)" }}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderTop: "4px solid var(--success)" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "0.5rem" }}>Total Income</h3>
          <p style={{ fontSize: "1.75rem", fontWeight: "600" }}>+${totalIncome.toFixed(2)}</p>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderTop: "4px solid var(--danger)" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "0.5rem" }}>Total Expense</h3>
          <p style={{ fontSize: "1.75rem", fontWeight: "600" }}>-${totalExpense.toFixed(2)}</p>
        </div>
      </section>

      {/* Transactions List */}
      <section className="glass-panel" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          Recent Transactions
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.6, padding: "2rem 0" }}>Loading your data...</p>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1rem", opacity: 0.8 }}>No transactions yet.</p>
            <p style={{ opacity: 0.6, marginBottom: "2rem" }}>Add your first transaction to see it here!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {transactions.map((t) => (
              <div key={t.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "1rem", borderRadius: "var(--radius-sm)",
                background: "var(--surface)", border: "1px solid var(--border)",
                transition: "var(--transition)"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    background: t.type === 'Income' ? 'rgba(6, 214, 160, 0.1)' : 'rgba(239, 71, 111, 0.1)',
                    color: t.type === 'Income' ? 'var(--success)' : 'var(--danger)',
                    fontSize: "1.2rem"
                  }}>
                    {t.type === 'Income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: "600", fontSize: "1.1rem" }}>{t.description}</h4>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.25rem", fontSize: "0.85rem", opacity: 0.7 }}>
                      <span>{new Date(t.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{t.category}</span>
                      <span>•</span>
                      <span style={{
                        padding: "0.1rem 0.5rem", borderRadius: "var(--radius-full)",
                        background: "var(--border)", fontSize: "0.75rem"
                      }}>{t.necessity}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontWeight: "700", fontSize: "1.2rem",
                    color: t.type === 'Income' ? 'var(--success)' : 'var(--foreground)'
                  }}>
                    {t.type === 'Income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
