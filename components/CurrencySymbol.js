"use client"

import { useAuth } from '@/components/AuthProvider'

// Map of currency codes to their display symbols
export const CURRENCIES = [
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
    { code: 'OMR', symbol: '﷼', name: 'Omani Rial' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
]

// Helper to get the symbol for a given currency code
export function getCurrencySymbol(code) {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency ? currency.symbol : 'د.إ'
}

// The original Dirham SVG icon (D with two horizontal lines)
const DirhamSvg = ({ className = "", style = {} }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'baseline', flexShrink: 0, ...style }}
    >
        <path d="M8 3v18h5a9 9 0 0 0 0-18H8z" />
        <line x1="3" y1="9.5" x2="14" y2="9.5" />
        <line x1="3" y1="14.5" x2="14" y2="14.5" />
    </svg>
)

// Drop-in replacement for <Dirham />
// Reads the user's currency from the AuthProvider context
// Falls back to user_metadata.currency (always available from signup) if profile.currency is not set
export const CurrencySymbol = ({ className = "", style = {} }) => {
    const { profile, user } = useAuth()
    const currencyCode = profile?.currency || user?.user_metadata?.currency || 'AED'

    // Use the original Dirham SVG icon for AED
    if (currencyCode === 'AED') {
        return <DirhamSvg className={className} style={style} />
    }

    const symbol = getCurrencySymbol(currencyCode)

    return (
        <span
            className={className}
            style={{
                display: 'inline-block',
                verticalAlign: 'baseline',
                fontWeight: 'inherit',
                fontSize: '0.85em',
                lineHeight: 1,
                ...style
            }}
        >
            {symbol}
        </span>
    )
}
