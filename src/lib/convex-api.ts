/**
 * Re-exports the Convex generated API from a location inside src/
 * so client components can import it via the @/* path alias.
 *
 * The generated api.js just exports `anyApi` from "convex/server" —
 * this file re-exports it from the canonical location so there is
 * exactly one import path to maintain if the Convex directory moves.
 */
export { api } from "../../convex/_generated/api";
