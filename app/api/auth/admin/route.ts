import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: 1 },
    });

    if (!admin) {
      // Si la base n'est pas initialisée, on accepte le mot de passe s'il correspond à NathanLeMeilleur
      // Mais dans l'idéal il faut lancer le seed
      if (password === 'NathanLeMeilleur') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, message: 'Admin non configuré' }, { status: 500 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (isValid) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe admin', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}