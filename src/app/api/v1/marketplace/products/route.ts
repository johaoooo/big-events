import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/store';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') || 20);
  return NextResponse.json({
    data: db.products.slice(0, limit),
    total: db.products.length
  });
}
