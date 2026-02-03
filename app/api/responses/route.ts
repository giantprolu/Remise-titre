import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const responses = await prisma.response.findMany({
      orderBy: {
        createdAt: 'desc'
      }
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
    const { name, question1, question2, question3 } = body;

    if (!name || !question1 || !question2 || !question3) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const response = await prisma.response.create({
      data: {
        name,
        question1,
        question2,
        question3
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
