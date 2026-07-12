/**
 * Convex API reference for client components.
 *
 * The generated convex/_generated/api.js exports `anyApi` from "convex/server",
 * but Turbopack cannot resolve imports pointing at the convex/ directory
 * (it's excluded from tsconfig). This file provides the same value directly
 * so client components can import it via the @/* alias.
 */
import { anyApi } from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```ts
 * import { api } from "@/lib/convex-api";
 * const items = useQuery(api.gallery.getPublicItems, { limit: 20 });
 * ```
 */
export const api = anyApi;
