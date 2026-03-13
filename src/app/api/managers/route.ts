import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    const managers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        store: true,
        avatarUrl: true,
        averageRating: true,
        totalRatings: true,
      },
      orderBy: {
        averageRating: 'desc',
      },
    })

    return NextResponse.json({ managers })
  } catch (error) {
    console.error('Get managers error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar gestores' },
      { status: 500 }
    )
  }
}

// Rota para criar novo gestor (apenas admin/desenvolvimento)
export async function POST(request: Request) {
  try {
    // Em produção, adicione verificação de permissão admin
    const session = await getSession()

    const body = await request.json()
    const { name, email, password, role, store, slackUserId } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nome, email, senha e cargo são obrigatórios' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        store,
        slackUserId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        store: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Create manager error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar gestor' },
      { status: 500 }
    )
  }
}
