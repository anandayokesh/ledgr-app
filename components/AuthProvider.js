"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchProfile = async (userId) => {
        if (!userId) {
            setProfile(null);
            return;
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setProfile(data);
        }
    };

    // Exposed function so pages can trigger a profile re-fetch (e.g. after saving settings)
    const refreshProfile = async () => {
        if (user?.id) {
            await fetchProfile(user.id);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                if (error.message.includes('Refresh Token Not Found')) {
                    await supabase.auth.signOut();
                } else {
                    console.error("Error getting session:", error.message);
                }
            }
            if (isMounted) {
                setSession(session);
                setUser(session?.user ?? null);
            }
            if (session?.user?.id) {
                await fetchProfile(session.user.id);
            }
            if (isMounted) setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (isMounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
                if (session?.user?.id) {
                    await fetchProfile(session.user.id);
                } else if (isMounted) {
                    setProfile(null);
                }
                if (isMounted) setLoading(false);
            }
        );

        return () => {
            isMounted = false;
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, session, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
