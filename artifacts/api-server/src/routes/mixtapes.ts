import { Router, type IRouter, type Request, type Response } from "express";
import { db, mixtapesTable } from "@workspace/db";
import { eq, desc, count, ilike } from "drizzle-orm";
import {
  CreateMixtapeBody,
  UpdateMixtapeBody,
  GetMixtapeParams,
  UpdateMixtapeParams,
  DeleteMixtapeParams,
  ListMixtapesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/mixtapes", async (req: Request, res: Response) => {
  const parsed = ListMixtapesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }
  const { genre, limit = 20, offset = 0 } = parsed.data;

  try {
    const whereClause = genre ? ilike(mixtapesTable.genre, `%${genre}%`) : undefined;

    const [mixtapes, totalResult] = await Promise.all([
      db
        .select()
        .from(mixtapesTable)
        .where(whereClause)
        .orderBy(desc(mixtapesTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(mixtapesTable).where(whereClause),
    ]);

    res.json({ mixtapes, total: Number(totalResult[0].count) });
  } catch (err) {
    req.log.error({ err }, "Error listing mixtapes");
    res.status(500).json({ error: "Failed to list mixtapes" });
  }
});

router.post("/mixtapes", async (req: Request, res: Response) => {
  const parsed = CreateMixtapeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [mixtape] = await db
      .insert(mixtapesTable)
      .values({
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        genre: parsed.data.genre ?? null,
        coverImagePath: parsed.data.coverImagePath ?? null,
        audioPath: parsed.data.audioPath,
        tracklistText: parsed.data.tracklistText ?? null,
        featured: parsed.data.featured ?? false,
        releaseDate: parsed.data.releaseDate ? new Date(parsed.data.releaseDate) : null,
      })
      .returning();

    res.status(201).json(mixtape);
  } catch (err) {
    req.log.error({ err }, "Error creating mixtape");
    res.status(500).json({ error: "Failed to create mixtape" });
  }
});

router.get("/mixtapes/:id", async (req: Request, res: Response) => {
  const parsed = GetMixtapeParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const [mixtape] = await db
      .select()
      .from(mixtapesTable)
      .where(eq(mixtapesTable.id, parsed.data.id))
      .limit(1);

    if (!mixtape) {
      res.status(404).json({ error: "Mixtape not found" });
      return;
    }

    res.json(mixtape);
  } catch (err) {
    req.log.error({ err }, "Error fetching mixtape");
    res.status(500).json({ error: "Failed to fetch mixtape" });
  }
});

router.put("/mixtapes/:id", async (req: Request, res: Response) => {
  const paramsParsed = UpdateMixtapeParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const bodyParsed = UpdateMixtapeBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (bodyParsed.data.title !== undefined) updateData.title = bodyParsed.data.title;
    if (bodyParsed.data.description !== undefined) updateData.description = bodyParsed.data.description;
    if (bodyParsed.data.genre !== undefined) updateData.genre = bodyParsed.data.genre;
    if (bodyParsed.data.coverImagePath !== undefined) updateData.coverImagePath = bodyParsed.data.coverImagePath;
    if (bodyParsed.data.audioPath !== undefined) updateData.audioPath = bodyParsed.data.audioPath;
    if (bodyParsed.data.tracklistText !== undefined) updateData.tracklistText = bodyParsed.data.tracklistText;
    if (bodyParsed.data.featured !== undefined) updateData.featured = bodyParsed.data.featured;
    if (bodyParsed.data.releaseDate !== undefined) {
      updateData.releaseDate = bodyParsed.data.releaseDate ? new Date(bodyParsed.data.releaseDate) : null;
    }

    const [updated] = await db
      .update(mixtapesTable)
      .set(updateData)
      .where(eq(mixtapesTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Mixtape not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating mixtape");
    res.status(500).json({ error: "Failed to update mixtape" });
  }
});

router.delete("/mixtapes/:id", async (req: Request, res: Response) => {
  const parsed = DeleteMixtapeParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const [deleted] = await db
      .delete(mixtapesTable)
      .where(eq(mixtapesTable.id, parsed.data.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Mixtape not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting mixtape");
    res.status(500).json({ error: "Failed to delete mixtape" });
  }
});

export default router;
