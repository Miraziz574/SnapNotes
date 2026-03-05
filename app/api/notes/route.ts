import { NextRequest, NextResponse } from 'next/server';
import { getNotes, deleteNote, getSubjects } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') ?? undefined;
    const subjectsOnly = searchParams.get('subjects') === 'true';

    if (subjectsOnly) {
      const subjects = getSubjects();
      return NextResponse.json({ subjects });
    }

    const notes = getNotes(subject);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Note id is required' },
        { status: 400 }
      );
    }

    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid note id' }, { status: 400 });
    }

    const success = deleteNote(numId);
    if (!success) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/notes error:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
