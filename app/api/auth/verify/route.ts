import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    // если код не передан
    if (!code) {
      return NextResponse.json({ error: 'Код не верный' }, { status: 400 });
    }
    // ищем код в базе данных
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode) {
      return NextResponse.json({ error: 'Не верный код' }, { status: 400 });
    }

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        verified: new Date(), // устанавливаем дату верификации
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id, // удаляем код после верификации
      },
    });

    return NextResponse.redirect(new URL('/?verified', req.url));
  } catch (error) {
    console.error(error);
    console.log('[VERIFY_GET]', error);
  }
}
