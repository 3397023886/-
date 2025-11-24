import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createEmotionRecord, deleteEmotionRecord, getUserEmotionRecords } from "./db";

/**
 * Generate music parameters based on emotion, color, and intensity
 * Maps emotional states to musical characteristics
 */
function generateMusicParams(emotion: string, color: string, intensity: number) {
  // Convert hex color to RGB
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Emotion to musical scale mapping
  const emotionScales: Record<string, number[]> = {
    happy: [0, 2, 4, 5, 7, 9, 11],
    sad: [0, 3, 5, 6, 8, 10],
    calm: [0, 2, 4, 7, 9],
    energetic: [0, 1, 3, 5, 6, 8, 10],
    angry: [0, 3, 5, 6, 7, 10],
    nostalgic: [0, 2, 3, 5, 7, 8, 10],
  };

  const scale = emotionScales[emotion.toLowerCase()] || emotionScales.calm;

  // Base frequency influenced by color brightness
  const brightness = (r + g + b) / 3;
  const baseFrequency = 220 + brightness * 220;

  // Tempo influenced by intensity
  const tempo = 60 + intensity * 1.4;

  // Duration influenced by emotion
  const durationMap: Record<string, number> = {
    happy: 8,
    sad: 12,
    calm: 10,
    energetic: 6,
    angry: 5,
    nostalgic: 10,
  };
  const duration = durationMap[emotion.toLowerCase()] || 8;

  return {
    scale,
    baseFrequency: Math.round(baseFrequency),
    tempo: Math.round(tempo),
    duration,
    color: { r, g, b },
    intensity,
    emotion,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  emotion: router({
    generate: protectedProcedure
      .input(
        z.object({
          emotion: z.string().min(1),
          color: z.string().regex(/^#[0-9A-F]{6}$/i),
          intensity: z.number().min(0).max(100).default(50),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const musicParams = generateMusicParams(input.emotion, input.color, input.intensity);

        await createEmotionRecord({
          userId: ctx.user.id,
          emotion: input.emotion,
          color: input.color,
          intensity: input.intensity,
          musicParams: JSON.stringify(musicParams),
          notes: input.notes,
        });

        return {
          success: true,
          musicParams,
        };
      }),

    history: protectedProcedure.query(async ({ ctx }) => {
      const records = await getUserEmotionRecords(ctx.user.id);
      return records.map((r) => ({
        ...r,
        musicParams: JSON.parse(r.musicParams),
      }));
    }),

    delete: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteEmotionRecord(input.recordId, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
