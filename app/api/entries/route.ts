import { NextResponse } from "next/server";
import { createEntry, getLastTenEntries } from "@/lib/entries";
import { logEntrySchema } from "@/lib/validation";

export async function GET() {
  try {
    const entries = await getLastTenEntries();
    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load entries",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = logEntrySchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid entry",
          issues: result.error.flatten()
        },
        { status: 400 }
      );
    }

    const entry = await createEntry(result.data);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to save entry",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
