import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Ledgr | Premium Transaction Tracker",
  description: "A fast, beautiful, and secure way to track your expenses and income.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
