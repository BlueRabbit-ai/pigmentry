"use client";

import { useState } from "react";
import { GenerationCard } from "@/components/app/generation-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/landing/image-placeholder";
import { Download, Filter } from "lucide-react";
import Link from "next/link";

type GenerationStatus = "pending" | "processing" | "completed" | "failed";

interface Generation {
  id: string;
  styleName: string;
  sizeLabel: string;
  status: GenerationStatus;
  creditsCharged: number;
  createdAt: string;
  previewUrl?: string;
}

// Real generation data will be fetched from Convex in production
const ALL_GENERATIONS: Generation[] = [];

function filterGenerations(
  gens: Generation[],
  filter: string
): Generation[] {
  if (filter === "all") return gens;
  return gens.filter((g) => g.status === filter);
}

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filterGenerations(ALL_GENERATIONS, filter);

  const counts = {
    all: ALL_GENERATIONS.length,
    completed: ALL_GENERATIONS.filter((g) => g.status === "completed").length,
    failed: ALL_GENERATIONS.filter((g) => g.status === "failed").length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Generation History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {counts.all} generation{counts.all !== 1 ? "s" : ""} total —{" "}
              {counts.completed} completed
            </p>
          </div>
        </div>

        {/* Filters */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v.value as string)}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({counts.completed})
            </TabsTrigger>
            <TabsTrigger value="failed">Failed ({counts.failed})</TabsTrigger>
            <TabsTrigger value="processing">Processing (0)</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Download All */}
        {filtered.filter((g) => g.status === "completed").length > 0 && (
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" disabled>
              <Download className="size-4" />
              Download All Completed
            </Button>
          </div>
        )}

        {/* Generation List */}
        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <ImagePlaceholder
                aspectRatio="16:9"
                className="max-w-xs mx-auto mb-4"
              />
              <h3 className="font-semibold">No generations found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {filter === "all"
                  ? "Create your first painting to see it here."
                  : `No ${filter} generations to show.`}
              </p>
              {filter === "all" && (
                <Link href="/app/new">
                  <Button size="sm">Create Painting</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((gen) => (
              <GenerationCard key={gen.id} {...gen} />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Credits Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {ALL_GENERATIONS.reduce(
                  (sum, g) => sum + g.creditsCharged,
                  0
                )}
              </div>
              <CardDescription>Across all generations</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {ALL_GENERATIONS.length > 0
                  ? Math.round(
                      (counts.completed / ALL_GENERATIONS.length) * 100
                    )
                  : 0}
                %
              </div>
              <CardDescription>
                {counts.completed} of {ALL_GENERATIONS.length} successful
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Favorite Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Classic Oil</div>
              <CardDescription>Used in 2 generations</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
