"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const convex = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url) {
            // During build time or if URL is missing, return null
            return null;
        }
        return new ConvexReactClient(url);
    }, []);

    // If no Convex client (build time or missing config), render children without provider
    if (!convex) {
        return <>{children}</>;
    }

    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
