# AI Oil Painting Website Build Plan

## Executive overview

This project should be built as a two-part product: a public, SEO-driven marketing site on `/` and a protected application experience behind authentication for uploads, generations, billing, and downloads.[cite:167][cite:114] The landing page should explain the product, show examples, display pricing, answer objections, and drive sign-up, while the actual image conversion workflow should live in authenticated routes such as `/app`, `/app/new`, and `/app/history`.[cite:167][cite:114]

That route split is the most logical architecture because Clerk Billing for B2C is designed around authenticated individual users and plan entitlements, and Clerk explicitly recommends a dedicated pricing page using the `<PricingTable />` component rather than mixing billing logic into an unauthenticated generation form on the homepage.[cite:167] It also makes SEO cleaner, because public intent pages can be crawlable while generation and account pages remain non-indexed application surfaces.[cite:167][cite:114]

## Corrected product architecture

### Public site

The public site should contain only discoverable marketing and informational content.

| Route | Purpose | Indexable |
|---|---|---|
| `/` | Landing page with hero, examples, trust, benefits, pricing teaser, FAQ, CTA | Yes |
| `/pricing` | Dedicated pricing page using Clerk Billing pricing UI or custom pricing copy | Yes |
| `/examples` | Curated gallery of before/after outputs | Yes |
| `/sizes` | Supported sizes and output presets, e.g. phone, laptop, custom | Yes |
| `/styles` | Style presets and visual explanations | Yes |
| `/how-it-works` | Simple step-by-step explainer | Yes |
| `/blog/...` | SEO content and educational pages | Yes |
| `/login` and `/sign-up` | Auth entry points | Usually noindex |

### Authenticated app

The actual functionality should sit behind login.

| Route | Purpose | Indexable |
|---|---|---|
| `/app` | Dashboard, usage summary, latest generations, CTA to create | No |
| `/app/new` | Upload and generation flow | No |
| `/app/history` | Generation history and downloads | No |
| `/app/billing` | Billing state, current plan, upgrade path | No |
| `/app/settings` | Account settings and profile controls | No |

This is the best UX split because users first understand the value proposition in a clean marketing flow, then authenticate before touching paid or quota-controlled compute features.[cite:167] It also removes awkward edge cases where an anonymous visitor could appear to “start” a generation but then hit auth friction halfway through the process.

## Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Good fit for SSR marketing pages, protected app routes, and Vercel deployment |
| UI | Tailwind CSS + shadcn/ui | Fast, polished SaaS UI with editable components |
| Auth | Clerk | Managed auth for individual B2C users, clean Next.js integration, broad free tier.[cite:100] |
| Billing | Clerk Billing | Simplifies recurring plans and plan/feature gating for B2C users.[cite:167][cite:174] |
| Backend | Convex | TypeScript-first backend for generation jobs, credit logic, audit records, and entitlements.[cite:154][cite:117] |
| Storage | Cloudflare R2 or equivalent object storage | Durable binary storage and low egress cost profile.[cite:99] |
| AI model | Gemini image generation | Core provider for transforming uploads into paintings.[cite:62] |
| Hosting | Vercel | Clean preview and production deployment workflow |

## Clerk Billing deep check

Clerk Billing for B2C is specifically built for charging **individual users**, and it supports Plans and Features that can be checked in the application with server-side helpers such as `has()` or with the `<Show>` component.[cite:167] Clerk also recommends using a dedicated pricing page with `<PricingTable />`, which reinforces the route split above instead of putting the conversion workflow directly on the public homepage.[cite:167]

A few details need to stay logically aligned with the final architecture:

- Clerk Billing uses Stripe **only for payment processing**; it is **not** Stripe Billing, and plans/subscriptions created in Clerk do not sync to Stripe Billing products.[cite:174][cite:167]
- Clerk states the pricing is **0.7% per transaction plus Stripe transaction fees**, which means billing convenience has a direct cost but removes much of the usual payment plumbing.[cite:167]
- Clerk Billing supports **monthly and annual subscriptions**, plan upgrades/downgrades, features, custom pricing, and B2C/B2B combinations.[cite:174][cite:167][cite:172]
- Clerk Billing currently supports **USD only**, does **not currently support tax/VAT**, and does **not currently support 3D Secure flows**, which is especially relevant for EU payments.[cite:174]
- Clerk Billing does **not support refunds** natively; refunds can be issued in Stripe, but they will not be reflected in Clerk MRR/income calculations.[cite:174]

This means Clerk Billing is excellent for speed and plan gating, but it is not a perfect long-term EU billing solution out of the box.[cite:174] For a Germany-based operator, the architecture should intentionally isolate billing-specific logic so the product can migrate to direct Stripe Billing or another billing stack later if VAT, EUR pricing, or stronger EU payment support becomes necessary.[cite:174]

## Pricing model

The pricing strategy should combine subscriptions and one-off packs. That is commercially stronger than choosing only one model, because some users want recurring access while others want a single batch of conversions without commitment.

### Why hybrid pricing is the right model

- Subscriptions work well with Clerk Billing’s native plan model and make revenue predictable.[cite:167][cite:174]
- One-off packs are good for first-time users who are not ready to subscribe.
- Packs should be more expensive per conversion than subscriptions, but not absurdly expensive.
- Output sizes should affect **credit usage**, not create a messy euro-price grid per resolution.

### Credit logic

| Output type | Credit cost | Reasoning |
|---|---:|---|
| Phone preset | 1 | Entry-level wallpaper export |
| Square preset | 1 | Low-friction basic output |
| Laptop preset | 2 | Wider canvas and more value |
| Custom size up to 2K | 2 | Flexible but bounded |
| Future premium export | 3 | Reserved for heavier or premium generation |

This keeps pricing legible for users and controllable for the app.

### Recommended visible prices

These are consumer-facing prices that work as a strong logical ladder.

| Product | Credits | Price shown to users | Role |
|---|---:|---:|---|
| Free trial | 1-2 total | €0 | Trust and onboarding |
| Starter Pack | 3 | €4.99 | Casual one-time use |
| Standard Pack | 10 | €9.99 | Occasional one-off buyer |
| Value Pack | 25 | €19.99 | Larger non-subscription use |
| Basic Monthly | 20 / month | €9.99 / month | Light repeat usage |
| Pro Monthly | 60 / month | €19.99 / month | Best-value main tier |
| Studio Monthly | 180 / month | €39.99 / month | Power users |

### Important billing reality for Germany

Because Clerk Billing currently supports only USD and does not currently handle tax/VAT, you should treat the euro prices above as **pricing strategy targets**, not literal values that Clerk can natively present and collect today.[cite:174] If you stay with Clerk Billing for MVP, the production launch may need either USD display/checkout with internal finance handling or a later migration to a billing stack that supports EUR and VAT correctly for EU consumers.[cite:174]

In other words, the logical pricing ladder is sound, but the current Clerk Billing product constraints mean the billing implementation and the desired Germany-facing commercial presentation are not yet perfectly aligned.[cite:174] That is the main system-level caveat in this build plan.

## Best launch recommendation

The most balanced path is:

1. Build the full app on Next.js + shadcn/ui + Clerk + Convex + Gemini.[cite:100][cite:154][cite:62]
2. Use Clerk Billing for a fast MVP if speed matters more than EU billing perfection.[cite:167][cite:174]
3. Keep billing abstraction clean so subscriptions and credits can later move to direct Stripe Billing or another payment layer if needed.[cite:174]
4. Use the public site for SEO and persuasion, not anonymous generation.

## Generation prompt integration

The product should use a server-side managed prompt template for the transformation request. The prompt should not be exposed as editable free text in the first version, because fixed presets are more reliable, easier to moderate, and easier to support.

### Primary oil-painting prompt

Use this as the default high-detail transform template stored on the server:

> Transform the supplied photograph into a high-end oil painting wallpaper with thick, visible brushstrokes that are clearly readable from a distance, but not overly smooth. The paint should have a balanced mix of clean expressive strokes and broken, edgy strokes, with some sharp bristle marks, scraped paint edges, and rough directional marks that add energy and hand-painted character. Preserve the original composition, subject placement, proportions, and key shapes, but simplify fine photographic detail into painterly forms. Keep the scene full-frame with no white painted border, no canvas frame, no margin, and no empty edge effect; the image must fill the entire rectangle naturally. Make the colors stronger and more vivid than a soft pastel painting, with richer saturation, deeper contrast, and more dramatic color temperature, while still staying elegant and not oversaturated. Use lively warm golds, rich reds, deep blues, emerald greens, burnt oranges, and creamy highlights, with strong shadow depth and glowing light transitions. The overall look should feel more vibrant and premium, like a bold contemporary oil painting rather than a pale or airy one. Keep skin tones, objects, and background colors richly layered and slightly intensified, with color variation inside each brushstroke instead of flat fills. The brushwork should be especially detailed in the main subject and foreground elements, with thicker impasto paint, visible stroke direction, and textured highlights, while the background can stay slightly looser but still painterly. Balance clarity and roughness: the image should look clean enough to read instantly as a polished artwork, but still have broken brush edges, uneven paint layering, and visible hand-painted movement. Maintain strong contrast between highlights and shadows, and preserve the mood and structure of the original image while making it look more artistic, more dimensional, and more alive. No text, no watermark, no timestamp, no UI elements, no photorealistic finish, no watercolor softness, no flat digital look, and no white borders.

### Prompt strategy

- Keep the full master prompt server-side.
- Let users choose presets such as “Classic Oil”, “Luxury Color”, “Selective Color”, or “Desktop Wallpaper”.
- Translate each preset into server-managed modifiers added around the master prompt.
- Do not let raw user text fully control the prompt in V1.

## SEO plan

The public site should target commercial and transformation-intent keywords, not vague AI-art traffic.

### Core keyword clusters

- ai oil painting generator
- photo to oil painting
- turn photo into painting
- ai painting wallpaper generator
- custom wallpaper generator from photo
- convert photo to painting wallpaper
- upload photo and make it a painting
- phone wallpaper generator from photo
- laptop wallpaper creator ai
- oil painting effect from image

### SEO route strategy

| Route | Primary keyword intent | UX goal |
|---|---|---|
| `/` | ai oil painting generator | Explain value and drive sign-up |
| `/pricing` | ai painting generator pricing | Convert commercial traffic |
| `/examples` | photo to oil painting examples | Build trust visually |
| `/sizes` | phone wallpaper from photo, laptop wallpaper ai | Capture size-specific intent |
| `/styles` | oil painting style presets | Capture style-driven searches |
| `/how-it-works` | how to convert a photo into a painting | Answer workflow questions |
| `/blog/...` | Long-tail support content | Build authority and internal links |

### UX and conversion notes for landing page

The landing page should not pretend to be the app. It should feel like a premium product site with:
- strong hero copy,
- examples gallery,
- visual explanation of size outputs,
- pricing teaser with CTA to full pricing page,
- FAQ,
- trust and simplicity messaging,
- sign-up CTA that leads into auth.

A good public CTA pattern is:
- “Start free”
- “See examples”
- “View pricing”

A good authenticated CTA pattern is:
- “Create painting”
- “Choose size”
- “Generate wallpaper”

## Security architecture

The system must assume every upload and every client field is hostile. The goal is to remove or sharply reduce the conditions that lead to OWASP Top 10 failures and common exploit chains.

### Upload safety

- Accept only JPEG, PNG, and WebP.
- Verify file signatures, not just extensions.
- Reject SVG, PDF, archives, executables, and scriptable formats.
- Enforce max size, max width/height, and max megapixel count.
- Re-encode every accepted image server-side into a safe raster format.
- Strip metadata and original filenames.
- Generate random storage keys.
- Store uploads only in object storage, not in a server-executable path.

### RCE and reverse-shell hardening

The app should be built so user input never reaches a shell, interpreter, or dynamic execution surface.

Required controls:
- No `exec`, `spawn`, or shell invocation with user-derived strings.
- No ImageMagick or CLI-based processing pipelines that interpolate user input into commands unless fully sandboxed and parameterized, and the simpler recommendation is to avoid shell-based processing entirely.
- No dynamic `eval`, `new Function`, unsafe deserialization, or user-controlled template execution.
- No support for scriptable uploads like SVG.
- No file writes into paths that could ever be served as executable code.
- Strict schema validation for every API and form payload.
- Server-side clamping of custom width/height fields.
- Rate limiting on upload and generation endpoints.
- Short-lived signed URLs for downloads.

These controls do not mean “perfectly impossible,” but they materially reduce classic payload, reverse-shell, and RCE pathways because the product never executes uploaded content and never passes user input into a shell-capable execution surface.

### OWASP alignment

#### Broken access control
- Server-side authorization on every read/write.
- User-scoped asset and generation ownership checks.
- Signed URLs for downloads.

#### Cryptographic failures
- HTTPS only.
- Secrets only in server env vars.
- No sensitive tokens in browser logs.

#### Injection
- Parameterized data access.
- No shell interpolation.
- No trusting prompt modifiers or custom size fields.

#### Insecure design
- Quotas, rate limits, abuse heuristics, and narrow feature scope in V1.

#### Security misconfiguration
- CSP, HSTS, Referrer-Policy, Permissions-Policy, strict CORS, production-safe error handling.

#### Vulnerable/outdated components
- Dependency scanning and patch cadence for Next.js, Clerk, Convex, and critical packages.[cite:100][cite:154]

#### Identification/authentication failures
- Clerk-managed auth with server-side checks.[cite:100]

#### Software/data integrity failures
- CI/CD secret protection, reviewed deployments, signed webhooks where used.

#### Logging/monitoring failures
- Audit logs for credit changes, generation failures, repeated upload rejection, suspicious activity.

#### SSRF
- No arbitrary URL imports in MVP.
- If later added, lock outbound fetch behavior to allowlists.

## Data model

Core entities should be:
- User
- PlanEntitlement
- CreditWallet
- Purchase
- GenerationJob
- SourceAsset
- OutputAsset
- PromptTemplate
- StylePreset
- AuditEvent

Recommended `GenerationJob` fields:
- id
- userId
- sourceAssetId
- outputAssetId
- presetSlug
- requestedWidth
- requestedHeight
- sizeClass
- creditsCharged
- status
- provider
- providerRequestId
- promptVersion
- errorCode
- createdAt
- completedAt

## Product logic

### Flow

1. User visits public landing page.
2. User views examples and pricing.
3. User signs up with Clerk.
4. User lands on `/app` dashboard.
5. User starts a generation in `/app/new`.
6. App validates entitlement and available credits.
7. App validates and normalizes upload.
8. App stores source asset.
9. App calls Gemini with the server-managed prompt.[cite:62]
10. App stores result and updates history.
11. User downloads output through a protected path.

### Entitlement logic

- Free trial users get a very small credit allowance.
- Subscriptions grant monthly credit allotments.
- One-off packs add non-recurring credits.
- Credits are decremented atomically at generation time.
- Failed jobs should either not deduct credits or should auto-refund in a reliable recovery flow.

## Final recommended build plan

### Phase 1: Foundation
- Next.js, Tailwind, shadcn/ui.
- Clerk auth and route protection.[cite:100]
- Convex schema and server actions.[cite:154]
- Object storage integration.[cite:99]

### Phase 2: Public site
- Landing page on `/`.
- Dedicated `/pricing` page.
- `/examples`, `/sizes`, `/styles`, `/how-it-works`.
- Metadata, schema markup, internal links.

### Phase 3: Protected app
- `/app` dashboard.
- `/app/new` generation flow.
- `/app/history` downloads and history.
- `/app/billing` entitlements and plan management.

### Phase 4: Billing
- Configure Clerk Billing plans for B2C users.[cite:167]
- Use Plans and Features for gating.[cite:167]
- Add one-off pack support through the most appropriate supported billing/product setup, keeping billing abstractions decoupled.[cite:172][cite:159]

### Phase 5: Security and QA
- Security headers.
- Abuse/rate limiting.
- Audit logging.
- Upload fuzz testing and malformed image testing.
- Mobile and desktop QA.

## Final conclusion

The corrected logical structure is: public landing and SEO pages on public routes, and all actual photo upload, billing-aware generation, and download functionality behind login.[cite:167][cite:114] That aligns better with Clerk Billing’s B2C model, cleaner SEO, cleaner UX, and more reliable quota enforcement.[cite:167]

The strongest current stack remains Next.js + shadcn/ui + Clerk + Clerk Billing + Convex + object storage + Gemini, but with one explicit caveat: Clerk Billing is excellent for fast subscription MVPs, yet its current USD-only, no-VAT, and no-3DS limitations mean it should be treated as an MVP-friendly billing layer rather than a perfectly final Germany/EU billing architecture.[cite:174]
