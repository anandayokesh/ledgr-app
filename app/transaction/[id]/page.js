"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Trash2, Edit2, X, Save } from 'lucide-react'
import { Dirham } from '@/components/Dirham'
import { useAuth } from '@/components/AuthProvider'

export default function TransactionDetails() {
    const params = useParams()
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)

    // Edit & Delete state
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [formData, setFormData] = useState(null)

    const categoriesUrl = {
        Income: ['Salary', 'Rent', 'Dividend', 'Interest', 'Gift'],
        Expense: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
    }
    const necessityOptions = ['Need', 'Want', 'Savings', 'Wasted']

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        } else if (user && params?.id) {
            fetchTransaction()
        }
    }, [user, authLoading, params])

    async function fetchTransaction() {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) throw error
            if (data) {
                setTransaction(data)
                setFormData({
                    amount: data.amount,
                    date: data.date.split('T')[0], // format to YYYY-MM-DD for date input
                    description: data.description || '',
                    type: data.type,
                    category: data.category,
                    necessity: data.necessity
                })
            }
        } catch (error) {
            console.error('Error fetching transaction:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset category if type changes
            ...(name === 'type' ? { category: categoriesUrl[value][0] } : {})
        }))
    }

    async function handleSave() {
        setSaving(true)
        try {
            const dateObj = new Date(formData.date)
            // Restore timestamp part from original date if same day, or just set it to ISO start of day
            // But simplify by just passing the ISO string, Supabase handles YYYY-MM-DD

            const { error } = await supabase
                .from('transactions')
                .update({
                    amount: parseFloat(formData.amount),
                    date: formData.date,
                    description: formData.description,
                    type: formData.type,
                    category: formData.category,
                    necessity: formData.necessity
                })
                .eq('id', params.id)

            if (error) throw error

            // Re-fetch to get updated formatted view
            await fetchTransaction()
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating transaction:', error)
            alert('Failed to update transaction.')
        } finally {
            setSaving(false)
        }
    }

    async function handleDeleteConfirm() {
        setDeleting(true)
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', params.id)

            if (error) throw error
            router.push('/')
        } catch (error) {
            console.error('Error deleting transaction:', error)
            alert('Failed to delete transaction.')
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    if (loading || authLoading) {
        return (
            <main style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4f6fa" }}>
                <p style={{ opacity: 0.6, fontSize: "1.2rem", color: "#1a1a1a" }}>Loading details...</p>
            </main>
        )
    }

    if (!transaction && !loading) {
        return (
            <main style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4f6fa" }}>
                <p style={{ opacity: 0.6, fontSize: "1.2rem", color: "#1a1a1a" }}>Transaction not found.</p>
            </main>
        )
    }

    const { amount, date, description, type, category, necessity, id } = transaction
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-GB') // DD/MM/YYYY approx
    const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const isIncome = type === 'Income'

    const amountColor = isIncome ? "#2db35b" : "#1a1a1a"

    const primaryButtonStyle = {
        padding: "1rem",
        borderRadius: "var(--radius-full)",
        background: "var(--primary)",
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
        flex: 1,
        gap: "0.5rem"
    }

    const secondaryButtonStyle = {
        padding: "1rem",
        borderRadius: "var(--radius-full)",
        background: "rgba(239, 71, 111, 0.1)",
        color: "var(--danger)",
        fontWeight: "700",
        fontSize: "1rem",
        border: "none",
        cursor: "pointer",
        transition: "var(--transition)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: "0.5rem"
    }

    const defaultInputStyle = {
        padding: "0.5rem",
        borderRadius: "8px",
        border: "1px solid rgba(0,0,0,0.1)",
        width: "100%",
        fontSize: "0.95rem",
        color: "#1a1a1a"
    }

    return (
        <main className="animate-fade-in" style={{
            minHeight: "100vh",
            background: "#f4f6fa",
            color: "#1a1a1a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <div style={{ width: "100%", maxWidth: "450px", position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

                {/* Header */}
                <header style={{ display: "flex", alignItems: "center", padding: "1.5rem", paddingBottom: "1rem" }}>
                    {isEditing ? (
                        <button onClick={() => setIsEditing(false)} style={{ padding: "0.5rem", borderRadius: "50%", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1a1a1a" }}>
                            <X size={24} />
                        </button>
                    ) : (
                        <Link href="/" style={{ padding: "0.5rem", borderRadius: "50%", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1a1a1a" }}>
                            <ArrowLeft size={24} />
                        </Link>
                    )}
                    <h1 style={{ flex: 1, textAlign: "center", fontSize: "1.2rem", fontWeight: "600", marginRight: "2.5rem" /* to offset back button */ }}>
                        {isEditing ? "Edit Transaction" : "Transaction"}
                    </h1>
                </header>

                {/* Receipt Card */}
                <div style={{ flex: 1, padding: "0 1.5rem" }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        position: "relative",
                        overflow: "hidden", // clip extra
                        paddingBottom: "1.5rem",
                        marginBottom: "1rem"
                    }}>

                        {/* Top Icon & Amount section */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "2rem", paddingBottom: "1.5rem", borderBottom: "1px dashed rgba(0,0,0,0.1)", margin: "0 1.5rem" }}>

                            <div style={{ width: "56px", height: "56px", background: "#e8f7ed", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                {isEditing ? <Edit2 size={24} color="#2db35b" /> : <Check size={28} color="#2db35b" strokeWidth={3} />}
                            </div>

                            {isEditing ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <Dirham />
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleFormChange}
                                        style={{ ...defaultInputStyle, fontSize: "2rem", fontWeight: "700", textAlign: "center", background: "#f8f9fa" }}
                                    />
                                </div>
                            ) : (
                                <h2 style={{ fontSize: "2rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.1rem", marginBottom: "0.5rem", color: amountColor, letterSpacing: "-0.5px" }}>
                                    {isIncome ? '+' : '-'}<Dirham /> {Number(amount).toFixed(2)}
                                </h2>
                            )}

                            {!isEditing && (
                                <div style={{ background: "#f8f9fa", padding: "0.4rem 0.8rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "rgba(0,0,0,0.6)", fontWeight: "500" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#2db35b", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ width: "2px", height: "6px", background: "#fff", borderRadius: "1px" }}></div>
                                    </div>
                                    {isIncome ? category : `${category} wallet \u2022 ${necessity}`}
                                </div>
                            )}
                        </div>

                        {/* Details List */}
                        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isEditing ? "center" : "flex-start", fontSize: "0.95rem" }}>
                                <span style={{ color: "rgba(0,0,0,0.5)", width: "120px" }}>Date</span>
                                {isEditing ? (
                                    <input type="date" name="date" value={formData.date} onChange={handleFormChange} style={defaultInputStyle} />
                                ) : (
                                    <span style={{ fontWeight: "500", color: "#1a1a1a", textAlign: "right" }}>{formattedDate}; {timeString}</span>
                                )}
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isEditing ? "center" : "flex-start", fontSize: "0.95rem" }}>
                                <span style={{ color: "rgba(0,0,0,0.5)", width: "120px" }}>{isEditing ? (formData.type === 'Income' ? 'Source' : 'Category') : (isIncome ? 'Source' : 'Category')}</span>
                                {isEditing ? (
                                    <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                                        <select name="type" value={formData.type} onChange={handleFormChange} style={{ ...defaultInputStyle, flex: 1 }}>
                                            <option value="Expense">Expense</option>
                                            <option value="Income">Income</option>
                                        </select>
                                        <select name="category" value={formData.category} onChange={handleFormChange} style={{ ...defaultInputStyle, flex: 1 }}>
                                            {categoriesUrl[formData.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <span style={{ fontWeight: "500", color: "#1a1a1a", textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                        <span>{type}</span>
                                        <span style={{ color: "rgba(0,0,0,0.6)", fontSize: "0.85em" }}>{category}</span>
                                    </span>
                                )}
                            </div>

                            {/* Intent (Necessity) - only show if Expense */}
                            {(!isEditing && !isIncome) && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                    <span style={{ color: "rgba(0,0,0,0.5)" }}>Intent</span>
                                    <span style={{ fontWeight: "500", color: "#1a1a1a" }}>{necessity}</span>
                                </div>
                            )}

                            {(isEditing && formData.type === 'Expense') && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.95rem" }}>
                                    <span style={{ color: "rgba(0,0,0,0.5)", width: "120px" }}>Intent</span>
                                    <select name="necessity" value={formData.necessity} onChange={handleFormChange} style={defaultInputStyle}>
                                        {necessityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isEditing ? "center" : "flex-start", fontSize: "0.95rem" }}>
                                <span style={{ color: "rgba(0,0,0,0.5)", width: "120px" }}>{isIncome ? 'Received from / Desc' : 'Paid to / Desc'}</span>
                                {isEditing ? (
                                    <input type="text" name="description" value={formData.description} onChange={handleFormChange} style={defaultInputStyle} placeholder="Description" />
                                ) : (
                                    <span style={{ fontWeight: "500", color: "#1a1a1a", textAlign: "right" }}>{description || 'N/A'}</span>
                                )}
                            </div>

                            {!isEditing && (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                        <span style={{ color: "rgba(0,0,0,0.5)" }}>Amount {isIncome ? 'received' : 'sent'}</span>
                                        <span style={{ fontWeight: "500", color: "#1a1a1a", display: "flex", alignItems: "center", gap: "0.1rem" }}><Dirham /> {Number(amount).toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Jagged bottom effect via SVG */}
                        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: "14px", overflow: "hidden" }}>
                            <svg viewBox="0 0 400 20" preserveAspectRatio="none" style={{ width: "100%", height: "100%", fill: "#f4f6fa" }}>
                                <path d="M0,20 L0,0 L10,20 L20,0 L30,20 L40,0 L50,20 L60,0 L70,20 L80,0 L90,20 L100,0 L110,20 L120,0 L130,20 L140,0 L150,20 L160,0 L170,20 L180,0 L190,20 L200,0 L210,20 L220,0 L230,20 L240,0 L250,20 L260,0 L270,20 L280,0 L290,20 L300,0 L310,20 L320,0 L330,20 L340,0 L350,20 L360,0 L370,20 L380,0 L390,20 L400,0 L400,20 Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ padding: "0 1.5rem 2rem", display: "flex", gap: "1rem", backgroundColor: "#f4f6fa" }}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{
                                    ...secondaryButtonStyle,
                                    background: "#e2e8f0", // Neutral grey outline style for cancel
                                    color: "#475569"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={primaryButtonStyle}
                                onClick={handleSave}
                                disabled={saving}
                                onMouseEnter={(e) => {
                                    if (!saving) {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.5)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!saving) {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.4)";
                                    }
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Details'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                style={secondaryButtonStyle}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 71, 111, 0.2)" }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 71, 111, 0.1)" }}
                            >
                                Delete
                            </button>
                            <button
                                style={primaryButtonStyle}
                                onClick={() => setIsEditing(true)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.5)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(67, 97, 238, 0.4)";
                                }}
                            >
                                Edit
                            </button>
                        </>
                    )}
                </div>

                {/* Delete Confirmation Modal Overlay */}
                {showDeleteConfirm && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem'
                    }} className="animate-fade-in">
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '2rem',
                            width: '100%',
                            maxWidth: '360px',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(239, 71, 111, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <Trash2 size={24} color="var(--danger)" />
                            </div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1a1a1a' }}>Delete transaction?</h3>
                            <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                                Are you sure you want to permanently delete this transaction? This action cannot be undone.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.85rem',
                                        borderRadius: 'var(--radius-full)',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        background: '#fff',
                                        color: '#1a1a1a',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    style={{
                                        flex: 1,
                                        padding: '0.85rem',
                                        borderRadius: 'var(--radius-full)',
                                        border: 'none',
                                        background: 'var(--danger)',
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(239, 71, 111, 0.4)'
                                    }}
                                >
                                    {deleting ? 'Deleting...' : 'Yes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
