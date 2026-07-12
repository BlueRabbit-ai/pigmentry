"use client";

import { useState, useCallback } from "react";
import { UploadZone } from "@/components/app/upload-zone";
import { StyleSelector } from "@/components/app/style-selector";
import { SizeSelector } from "@/components/app/size-selector";
import { CreditBalance } from "@/components/app/credit-balance";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { STYLE_PRESETS } from "@/lib/prompts";
import { SIZE_PRESETS, CREDIT_COSTS } from "@/lib/constants";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Palette,
  Monitor,
} from "lucide-react";

type Step = "upload" | "configure" | "generating" | "done";

export default function NewGenerationPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState("classic-oil");
  const [size, setSize] = useState("phone");

  const handleFileAccepted = useCallback((f: File) => {
    setFile(f);
    setStep("configure");
  }, []);

  const handleFileRemoved = useCallback(() => {
    setFile(null);
    setStep("upload");
  }, []);

  const handleGenerate = useCallback(() => {
    setStep("generating");
    // Simulate generation — real API call will go here in Phase 5
    setTimeout(() => {
      setStep("done");
    }, 3000);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setStyle("classic-oil");
    setSize("phone");
    setStep("upload");
  }, []);

  const selectedStyleName =
    STYLE_PRESETS.find((s) => s.slug === style)?.name ?? "Classic Oil";
  const selectedSizeName =
    SIZE_PRESETS.find((s) => s.slug === size)?.label ?? "Phone Wallpaper";
  const creditCost =
    CREDIT_COSTS[size as keyof typeof CREDIT_COSTS] ?? 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Painting
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a photo and choose your style
            </p>
          </div>
          <CreditBalance balance={0} />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {(["upload", "configure", "generating", "done"] as Step[]).map(
            (s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 ${
                    step === s
                      ? "text-foreground font-medium"
                      : step === "done" &&
                        (s === "upload" || s === "configure")
                        ? "text-muted-foreground"
                        : ""
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs border ${
                      step === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : step === "done" &&
                          (s === "upload" || s === "configure")
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {step === "done" && (s === "upload" || s === "configure")
                      ? "✓"
                      : i + 1}
                  </span>
                  <span className="hidden sm:inline">
                    {s === "upload"
                      ? "Upload"
                      : s === "configure"
                        ? "Configure"
                        : s === "generating"
                          ? "Generate"
                          : "Done"}
                  </span>
                </div>
                {i < 3 && (
                  <ArrowRight className="size-3 text-muted-foreground/40" />
                )}
              </div>
            )
          )}
        </div>

        {/* Step: Upload */}
        {(step === "upload" || step === "configure") && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              1. Upload Your Photo
            </h2>
            <UploadZone
              onFileAccepted={handleFileAccepted}
              onFileRemoved={handleFileRemoved}
              selectedFile={file}
            />
          </section>
        )}

        {/* Step: Configure */}
        {(step === "configure" || step === "generating") && (
          <>
            <Separator className="mb-8" />
            <section className="mb-8">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Palette className="size-4" />
                2. Choose Style
              </h2>
              <StyleSelector selected={style} onSelect={setStyle} />
            </section>

            <Separator className="mb-8" />
            <section className="mb-8">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Monitor className="size-4" />
                3. Choose Output Size
              </h2>
              <SizeSelector selected={size} onSelect={setSize} />
            </section>

            {/* Summary + Generate */}
            <Card className="bg-muted/30">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Style:</span>
                      <Badge variant="secondary">{selectedStyleName}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Size:</span>
                      <Badge variant="secondary">{selectedSizeName}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Cost:</span>
                      <Badge>
                        {creditCost} credit{creditCost > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={step === "generating"}
                    className="shrink-0"
                  >
                    {step === "generating" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Generate Painting
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step: Generating */}
        {step === "generating" && (
          <section className="mt-8">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="py-12 text-center">
                <Loader2 className="size-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold">
                  Creating Your Painting
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  The AI is transforming your photo into a{" "}
                  {selectedStyleName.toLowerCase()} oil painting at{" "}
                  {selectedSizeName.toLowerCase()} size.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  This usually takes under 30 seconds
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <section className="mt-8 space-y-6">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="size-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Painting Complete!</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your {selectedStyleName} painting is ready.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button>
                    <CheckCircle2 className="size-4" />
                    Download Painting
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Create Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
