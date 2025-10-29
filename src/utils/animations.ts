import { slide } from "astro:transitions";

const DEFAULT_SPRING = { mass: 1, stiffness: 170, damping: 26, precision: 0.001 } as const;

const DEFAULT_DURATION_CLAMP = { min: 180, max: 420 } as const;

export type SpringOptions = { mass?: number; stiffness?: number; damping?: number; precision?: number };

export type SpringDurationOptions = SpringOptions & { min?: number; max?: number };

export type SlideTransitionOptions = SpringDurationOptions & { name?: string; fallback?: "none" | "animate" | "swap" };

export type SlideTransitionConfig = {
  name: string;
  value: ReturnType<typeof slide>;
  duration: number;
  fallback: "none" | "animate" | "swap";
};

export function calculateSpringDuration({
  mass = DEFAULT_SPRING.mass,
  stiffness = DEFAULT_SPRING.stiffness,
  damping = DEFAULT_SPRING.damping,
  precision = DEFAULT_SPRING.precision,
}: SpringOptions = {}): number {
  if (mass <= 0 || stiffness <= 0 || damping < 0) {
    throw new Error("Spring options must be positive numbers");
  }

  const omega0 = Math.sqrt(stiffness / mass);
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const logPrecision = Math.log(1 / Math.max(precision, Number.EPSILON));

  if (dampingRatio < 1) {
    return (logPrecision / (dampingRatio * omega0)) * 1_000;
  }

  if (dampingRatio === 1) {
    return (logPrecision / omega0) * 1_000;
  }

  const dampedRoot = Math.sqrt(dampingRatio * dampingRatio - 1);
  return (logPrecision / (omega0 * (dampingRatio - dampedRoot))) * 1_000;
}

export function springDuration(options?: SpringDurationOptions): number {
  const rawDuration = calculateSpringDuration(options);
  const min = options?.min ?? DEFAULT_DURATION_CLAMP.min;
  const max = options?.max ?? DEFAULT_DURATION_CLAMP.max;
  const safeDuration = Number.isFinite(rawDuration) ? rawDuration : max;
  return Math.min(Math.max(safeDuration, min), max);
}

export function formatDuration(duration: number): string {
  return `${Math.round(duration)}ms`;
}

export function createSlideTransition({
  name = "page",
  fallback = "animate",
  ...springOptions
}: SlideTransitionOptions = {}): SlideTransitionConfig {
  const duration = Math.round(springDuration(springOptions));
  return { name, duration, fallback, value: slide({ duration: formatDuration(duration) }) };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
