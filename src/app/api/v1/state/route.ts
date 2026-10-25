import { NextResponse } from 'next/server';
import { getDb } from '@/lib/store';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db);
}
