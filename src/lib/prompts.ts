/**
 * Server-managed prompt templates for oil painting generation.
 *
 * Prompts are built dynamically from the user's style + size selections.
 * The master prompt provides the core oil-painting quality, style modifiers
 * adjust color and brush treatment, and size modifiers ensure the output
 * is optimized for the target device dimensions.
 *
 * Powered by Nano Banana Lite 2 (gemini-3.1-flash-lite-image).
 */

// ---------------------------------------------------------------------------
// Master prompt — core oil-painting quality (all generations)
// ---------------------------------------------------------------------------

export const MASTER_OIL_PAINTING_PROMPT = `Transform the supplied photograph into a high-end oil painting wallpaper with thick, visible brushstrokes that are clearly readable from a distance, but not overly smooth. The paint should have a balanced mix of clean expressive strokes and broken, edgy strokes, with some sharp bristle marks, scraped paint edges, and rough directional marks that add energy and hand-painted character. Preserve the original composition, subject placement, proportions, and key shapes, but simplify fine photographic detail into painterly forms. Keep the scene full-frame with no white painted border, no canvas frame, no margin, and no empty edge effect; the image must fill the entire rectangle naturally. Make the colors stronger and more vivid than a soft pastel painting, with richer saturation, deeper contrast, and more dramatic color temperature, while still staying elegant and not oversaturated. Use lively warm golds, rich reds, deep blues, emerald greens, burnt oranges, and creamy highlights, with strong shadow depth and glowing light transitions. The overall look should feel more vibrant and premium, like a bold contemporary oil painting rather than a pale or airy one. Keep skin tones, objects, and background colors richly layered and slightly intensified, with color variation inside each brushstroke instead of flat fills. The brushwork should be especially detailed in the main subject and foreground elements, with thicker impasto paint, visible stroke direction, and textured highlights, while the background can stay slightly looser but still painterly. Balance clarity and roughness: the image should look clean enough to read instantly as a polished artwork, but still have broken brush edges, uneven paint layering, and visible hand-painted movement. Maintain strong contrast between highlights and shadows, and preserve the mood and structure of the original image while making it look more artistic, more dimensional, and more alive. No text, no watermark, no timestamp, no UI elements, no photorealistic finish, no watercolor softness, no flat digital look, and no white borders.`;

// ---------------------------------------------------------------------------
// Style modifiers — color treatment and brush character
// ---------------------------------------------------------------------------

const STYLE_MODIFIERS: Record<string, string> = {
  "classic-oil": `Use a classic oil painting style with traditional brushwork, natural color tones, and balanced composition. The palette should lean toward warm earth tones — burnt sienna, yellow ochre, olive green, and ivory — with gentle transitions and realistic lighting. Brushwork should feel like a 19th-century studio painting: deliberate, refined, and harmonious.`,

  "luxury-color": `Intensify the color palette dramatically. Use richer golds, deeper indigos, ruby reds, emerald greens, and sapphire blues. Push the warm/cool contrast further — warm highlights against cool shadows, or vice versa. The overall effect should feel luxurious, cinematic, and emotionally charged, like a high-end gallery piece under dramatic gallery lighting. Make colors feel bold and confident without becoming garish.`,

  "selective-color": `Apply selective color treatment: keep the main subject richly saturated and vivid while desaturating the background into muted earth tones and soft grays. The subject should "pop" against a quieter backdrop — like a color focal effect. Background elements should still be painterly but noticeably more subdued, with 30-50% less saturation than the subject. This creates an artistic focal isolation.`,
};

// ---------------------------------------------------------------------------
// Size modifiers — composition and dimension-specific guidance
// ---------------------------------------------------------------------------

const SIZE_MODIFIERS: Record<string, string> = {
  phone: `The output is a tall vertical phone wallpaper (9:19.5 aspect ratio). Compose the painting to work in portrait orientation — emphasize vertical flow and place the main subject in the upper-center area where it won't be covered by lock-screen clocks or app icons. The bottom third should have slightly calmer brushwork so home-screen widgets remain readable. Crop and fill the full vertical frame without letterboxing.`,

  square: `The output is a square format (1:1 aspect ratio). Center the main subject or use a balanced radial composition that reads well at equal width and height. This format is ideal for social media profile pictures and posts — the subject should be clear even at small thumbnail sizes. Avoid compositions that feel cropped or unbalanced in a square frame.`,

  laptop: `The output is a wide laptop wallpaper (16:10 aspect ratio). Use a horizontal, cinematic composition with the main subject off-center (rule of thirds). Leave calm, less detailed areas on the left and right sides where desktop icons and dock typically sit. The center should have the strongest visual weight, but the entire wide canvas should feel intentionally composed — not stretched or empty. The top edge should be clean for the menu bar.`,

  custom: `The output is a custom-sized wallpaper. Adapt the composition to fill the requested dimensions naturally. Maintain proportional subject placement — don't stretch or squash. If the aspect ratio is unusual, balance the composition so no area feels empty or forced.`,
};

// ---------------------------------------------------------------------------
// Style presets (public metadata, used by the style selector UI)
// ---------------------------------------------------------------------------

export const STYLE_PRESETS = [
  {
    slug: "classic-oil",
    name: "Classic Oil",
    description:
      "Traditional oil painting look with balanced brushwork and natural colors.",
  },
  {
    slug: "luxury-color",
    name: "Luxury Color",
    description:
      "Rich, vibrant colors with bold contrast and dramatic lighting.",
  },
  {
    slug: "selective-color",
    name: "Selective Color",
    description:
      "Muted background with vibrant subject focus for artistic contrast.",
  },
];

// ---------------------------------------------------------------------------
// Prompt builder — combines master + style + size
// ---------------------------------------------------------------------------

/**
 * Build the final generation prompt.
 *
 * @param styleSlug  - The selected style preset (e.g. "classic-oil")
 * @param sizeSlug   - The selected output size (e.g. "phone", "laptop")
 * @returns            Full prompt string ready for the AI model
 */
export function buildGenerationPrompt(
  styleSlug: string,
  sizeSlug: string
): string {
  const styleModifier =
    STYLE_MODIFIERS[styleSlug] ?? STYLE_MODIFIERS["classic-oil"];
  const sizeModifier =
    SIZE_MODIFIERS[sizeSlug] ?? SIZE_MODIFIERS["phone"];

  return [
    MASTER_OIL_PAINTING_PROMPT,
    "",
    `STYLE DIRECTION (${styleSlug}):`,
    styleModifier,
    "",
    `SIZE & COMPOSITION (${sizeSlug}):`,
    sizeModifier,
  ].join("\n");
}

/**
 * Legacy wrapper — builds prompt with just a style slug using phone defaults.
 * @deprecated Use buildGenerationPrompt(styleSlug, sizeSlug) instead.
 */
export function buildGenerationPromptLegacy(styleSlug: string): string {
  return buildGenerationPrompt(styleSlug, "phone");
}
