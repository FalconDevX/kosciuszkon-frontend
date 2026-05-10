"use client";
import { useEffect, useState } from "react";
import { getStoredUserId, subscribeAuthChange } from "@/lib/auth-storage";
import { fetchUsernameByUserId } from "@/lib/user-profile";
export type CurrentUser = {
    userId: string | null;
    username: string | null;
    isLoading: boolean;
};
export function useCurrentUser(): CurrentUser {
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setUserId(getStoredUserId());
        setIsLoading(false);
        const unsubscribe = subscribeAuthChange((next) => setUserId(next));
        return unsubscribe;
    }, []);
    useEffect(() => {
        if (!userId) {
            setUsername(null);
            return;
        }
        let cancelled = false;
        fetchUsernameByUserId(userId)
            .then((name) => {
            if (!cancelled)
                setUsername(name);
        })
            .catch(() => {
            if (!cancelled)
                setUsername(null);
        });
        return () => {
            cancelled = true;
        };
    }, [userId]);
    return { userId, username, isLoading };
}
