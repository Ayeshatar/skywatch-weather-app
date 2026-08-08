import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export async function GET() {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json({ ok: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'No server settings found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // ensure directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Failed to save settings', err);
    return NextResponse.json({ ok: false, error: err.message || 'Failed to save' }, { status: 500 });
  }
}
