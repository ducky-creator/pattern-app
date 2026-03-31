import { randomUUID } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { PatternEntry, PatternEntryInput } from "@/lib/types";

const inMemoryEntries: PatternEntry[] = [];

export async function createEntry(input: PatternEntryInput): Promise<PatternEntry> {
  const id = randomUUID();
  const createdAt = Timestamp.now();
  const entry = {
    id,
    ...input,
    createdAt
  };

  const db = getDb();

  if (!db) {
    const fallbackEntry: PatternEntry = {
      ...input,
      id,
      createdAt: createdAt.toDate().toISOString()
    };

    inMemoryEntries.unshift(fallbackEntry);
    return fallbackEntry;
  }

  await db.collection("entries").doc(id).set(entry);
  return normalizeEntry(entry);
}

export async function getLastTenEntries(): Promise<PatternEntry[]> {
  const db = getDb();

  if (!db) {
    return inMemoryEntries.slice(0, 10);
  }

  const snapshot = await db
    .collection("entries")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  return snapshot.docs.map((doc) => normalizeEntry(doc.data() as { id: string; trigger: string; emotion: string; intensity: number; action: string; createdAt: string | Timestamp }));
}

function normalizeEntry(entry: {
  id: string;
  trigger: string;
  emotion: string;
  intensity: number;
  action: string;
  createdAt: Timestamp | string;
}): PatternEntry {
  const createdAt =
    typeof entry.createdAt === "string"
      ? entry.createdAt
      : entry.createdAt.toDate().toISOString();

  return {
    id: entry.id,
    trigger: entry.trigger,
    emotion: entry.emotion,
    intensity: entry.intensity,
    action: entry.action,
    createdAt
  };
}
