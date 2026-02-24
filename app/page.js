"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Home, Utensils, MoreHorizontal, ShoppingBag, Heart, Star, PiggyBank, Flame } from 'lucide-react'
import { Dirham } from '@/components/Dirham'

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else if (!authLoading) {
      // If no user but auth has loaded, fast loading off (shows sign in view)
      setLoading(false)
    }
  }, [user, authLoading])

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
      // Removed .limit(5) so stats compute over all data. We will slice the list below to 5.

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

  // Calculate stats over all fetched transactions
  const totalBalance = transactions.reduce((acc, curr) =>
    curr.type === 'Income' ? acc + Number(curr.amount) : acc - Number(curr.amount), 5560.43 // Initial seed for mock look
  )
  const totalIncome = transactions.reduce((acc, curr) =>
    curr.type === 'Income' ? acc + Number(curr.amount) : acc, 34343.00
  )
  const totalExpense = transactions.reduce((acc, curr) =>
    curr.type === 'Expense' ? acc + Number(curr.amount) : acc, 24343.00
  )

  // Calculate necessity stats (assuming we only sum Expenses for these categories, or absolute amounts. We'll sum absolute amounts for now)
  const sumNecessity = (necessity) => {
    return transactions.reduce((acc, curr) => curr.necessity === necessity ? acc + Number(curr.amount) : acc, 0)
  }

  const totalNeed = sumNecessity('Need') || 453.00 // fallback mock if 0 for visual check
  const totalWant = sumNecessity('Want') || 120.00
  const totalSavingsCat = sumNecessity('Savings') || 500.00
  const totalWasted = sumNecessity('Wasted') || 45.00

  // Total for percentage calculations (only counting transactions that have a necessity)
  const dynamicTotal = sumNecessity('Need') + sumNecessity('Want') + sumNecessity('Savings') + sumNecessity('Wasted') || 1;

  if (authLoading) {
    return (
      <main style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ opacity: 0.6, fontSize: "1.2rem" }}>Loading...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", textAlign: "center", background: "var(--background)" }}>
        <h1 style={{ fontSize: "5rem", fontWeight: "800", letterSpacing: "-0.04em", marginBottom: "1.5rem", color: "var(--primary)" }}>Ledgr</h1>
        <p style={{ fontSize: "1.3rem", color: "rgba(0,0,0,0.6)", maxWidth: "550px", marginBottom: "3.5rem", lineHeight: "1.5" }}>
          Premium transaction tracking to easily manage your assets and liabilities, secure and fully personal.
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/login"
            style={{
              padding: "0.85rem 2.5rem",
              borderRadius: "var(--radius-full)",
              background: "#ffffff",
              color: "var(--foreground)",
              fontWeight: "700",
              fontSize: "1.1rem",
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              transition: "var(--transition)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Log In
          </Link>
          <Link href="/signup"
            style={{
              padding: "0.85rem 2.5rem",
              borderRadius: "var(--radius-full)",
              background: "var(--primary)",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "1.1rem",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(67, 97, 238, 0.4)",
              transition: "var(--transition)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.4)";
            }}
          >
            Sign Up
          </Link>
        </div>
      </main>
    )
  }

  const formatBalance = (amount) => {
    const [intPart, fracPart] = Number(amount).toFixed(3).split('.')
    return {
      int: new Intl.NumberFormat('en-US').format(intPart),
      frac: fracPart
    }
  }
  const bal = formatBalance(totalBalance)

  return (
    <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--background)" }} className="animate-fade-in">

      {/* --- Light Top Section --- */}
      <section style={{ padding: "2rem 1.5rem 1rem", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "16px", background: "var(--border)", overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)" }}>
              {/* Mock Avatar */}
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9" alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--foreground)" }}>
                {profile?.first_name || 'Esther Howard'}
              </h2>
              <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "-2px" }}>Welcome Back</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.refresh()
            }}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "var(--radius-full)",
              background: "var(--primary)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "0.85rem",
              boxShadow: "0 4px 14px rgba(67, 97, 238, 0.3)",
              transition: "var(--transition)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.3)";
            }}
          >
            Log Out
          </button>
        </header>

        {/* Balance */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="text-muted" style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: "500" }}>Total Balance</p>
          <h1 style={{ display: "flex", alignItems: "baseline", color: "var(--foreground)", fontWeight: "600" }}>
            <span style={{ fontSize: "3rem", letterSpacing: "-1px" }}><Dirham /> {bal.int}</span>
            <span style={{ fontSize: "2rem", color: "#a0aabf" }}>.{bal.frac}</span>
          </h1>
        </div>

        {/* Income/Spendings Card */}
        <div style={{
          background: "var(--primary)",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(67, 97, 238, 0.4)",
          transform: "translateY(2rem)" // Pulls it over the dark section
        }}>
          <div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", fontWeight: "500", marginBottom: "0.25rem" }}>Income</p>
            <p style={{ fontSize: "1.2rem", fontWeight: "600", color: "#ffffff", display: "flex", alignItems: "center", gap: "0.2rem" }}>+<Dirham /> {totalIncome.toFixed(2)}</p>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.2)", height: "40px", alignSelf: "center" }}></div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", fontWeight: "500", marginBottom: "0.25rem" }}>Spendings</p>
            <p style={{ fontSize: "1.2rem", fontWeight: "600", color: "#ffffff", display: "flex", alignItems: "center", gap: "0.2rem" }}>-<Dirham /> {totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* --- Dark Bottom Section --- */}
      <section style={{
        flex: 1,
        background: "var(--bg-dark)",
        color: "var(--fg-dark)",
        borderTopLeftRadius: "var(--radius-xl)",
        borderTopRightRadius: "var(--radius-xl)",
        paddingTop: "4rem", // Space for the overhanging yellow card
        paddingBottom: "2rem"
      }}>

        {/* Categories Module */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.5rem", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "500" }}>Categories</h3>
            <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "var(--fg-dark)", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="hide-scrollbar" style={{ display: "flex", gap: "1rem", overflowX: "auto", padding: "0 1.5rem", paddingBottom: "1rem", snapType: "x mandatory" }}>

            {/* Add Button */}
            <Link href="/add" style={{ flexShrink: 0, snapAlign: "start", width: "80px", border: "1px dashed rgba(255,255,255,0.3)", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "var(--transition)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            >
              <Plus size={24} color="rgba(255,255,255,0.6)" />
            </Link>

            {/* Needs Card */}
            <div style={{ flexShrink: 0, snapAlign: "start", width: "160px", background: "var(--card-purple)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Heart size={18} color="#fff" />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Needs</span>
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><Dirham /> {totalNeed.toFixed(2)}</p>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem" }}>
                {Math.round((totalNeed / dynamicTotal) * 100)}%
              </span>
            </div>

            {/* Wants Card */}
            <div style={{ flexShrink: 0, snapAlign: "start", width: "160px", background: "var(--card-blue)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Star size={18} color="#fff" />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Wants</span>
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><Dirham /> {totalWant.toFixed(2)}</p>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem" }}>
                {Math.round((totalWant / dynamicTotal) * 100)}%
              </span>
            </div>

            {/* Savings Card */}
            <div style={{ flexShrink: 0, snapAlign: "start", width: "160px", background: "var(--card-green)", borderRadius: "var(--radius-lg)", padding: "1.5rem", color: "#000" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <PiggyBank size={18} color="#000" />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Savings</span>
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><Dirham /> {totalSavingsCat.toFixed(2)}</p>
              <span style={{ display: "inline-block", background: "rgba(0,0,0,0.1)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem" }}>
                {Math.round((totalSavingsCat / dynamicTotal) * 100)}%
              </span>
            </div>

            {/* Waste Card */}
            <div style={{ flexShrink: 0, snapAlign: "start", width: "160px", background: "var(--card-red)", borderRadius: "var(--radius-lg)", padding: "1.5rem", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Flame size={18} color="#fff" />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Waste</span>
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><Dirham /> {totalWasted.toFixed(2)}</p>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem" }}>
                {Math.round((totalWasted / dynamicTotal) * 100)}%
              </span>
            </div>

          </div>

          {/* Dots Indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "0.5rem" }}>
            <div style={{ width: "24px", height: "4px", background: "var(--card-yellow)", borderRadius: "var(--radius-full)" }}></div>
            <div style={{ width: "4px", height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "var(--radius-full)" }}></div>
            <div style={{ width: "4px", height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "var(--radius-full)" }}></div>
          </div>
        </div>

        {/* Transactions Module */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "500" }}>Transactions</h3>
            <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "var(--fg-dark)", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div style={{ padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Adding the mock shopping transaction exactly like in the picture as a top item if no data or to supplement */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ShoppingBag size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontWeight: "500", fontSize: "1rem" }}>Shopping</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "0.2rem" }}>Jan 11, 12:23</p>
                </div>
              </div>
              <p style={{ fontWeight: "500", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.1rem" }}>-<Dirham /> 211.00</p>
            </div>

            {loading ? (
              <p style={{ textAlign: "center", opacity: 0.5, padding: "1rem 0" }}>Loading...</p>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <div key={t.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {/* Simplified icon for DB items */}
                      <div style={{ color: t.type === 'Income' ? 'var(--success)' : 'var(--primary)', fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.1rem" }}>{t.type === 'Income' ? '+' : '-'}<Dirham /></div>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: "500", fontSize: "1rem" }}>{t.description}</h4>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontWeight: "500", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    {t.type === 'Income' ? '+' : '-'}<Dirham /> {Number(t.amount).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* Floating Action Button for Add Transaction */}
      <Link href="/add" style={{
        position: "fixed",
        bottom: "2rem",
        right: "1.5rem",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "var(--primary)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 10px 20px rgba(67, 97, 238, 0.4)",
        color: "#ffffff",
        zIndex: 50,
        transition: "var(--transition)"
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 14px 28px rgba(67, 97, 238, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(67, 97, 238, 0.4)";
        }}
      >
        <Plus size={28} />
      </Link>

    </main>
  )
}
