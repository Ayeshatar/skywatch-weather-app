import { NextResponse } from 'next/server';

// In-memory store of client last-seen timestamps (keeps only in server process lifetime)
const clients = new Map<string, number>();
const WINDOW_MS = 2 * 60 * 1000; // 2 minutes window

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    clients.set(id, Date.now());
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  const now = Date.now();
  // remove stale
  for (const [id, ts] of clients.entries()) {
    if (now - ts > WINDOW_MS) clients.delete(id);
  }
  return NextResponse.json({ active: clients.size });
}
