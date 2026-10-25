import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const limit = Number(searchParams.get('limit') || 100);

  let events = db.events;
  if (status) events = events.filter((e) => e.status === status);
  if (category && category !== 'ALL') events = events.filter((e) => e.category === category);

  return NextResponse.json({
    data: events.slice(0, limit),
    total: events.length
  });
}
