import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const full = request.nextUrl.searchParams.get('full') === '1';
    const responses = await prisma.response.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        question1: true,
        question2: true,
        isAnonymous: true,
        createdAt: true,
        // photo uniquement quand explicitement demandé (export PDF)
        ...(full ? { photo: true } : {}),
      },
    });
    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, question1, question2, photo, isAnonymous } = body;

    if (!name || !question1 || !question2) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await prisma.response.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existing) {
      const updated = await prisma.response.update({
        where: { id: existing.id },
        data: {
          question1,
          question2,
          photo: isAnonymous ? null : (photo ?? existing.photo),
          isAnonymous: isAnonymous ?? false
        }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    const response = await prisma.response.create({
      data: {
        name,
        question1,
        question2,
        photo: isAnonymous ? null : (photo ?? null),
        isAnonymous: isAnonymous ?? false
      }
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.response.deleteMany();
    return NextResponse.json({ message: 'All responses deleted' });
  } catch (error) {
    console.error('Error deleting responses:', error);
    return NextResponse.json({ error: 'Failed to delete responses' }, { status: 500 });
  }
}
