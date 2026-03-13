import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Criar gestores de exemplo
  const password = await bcrypt.hash('123456', 12)

  const managers = [
    {
      name: 'Maria Silva',
      email: 'maria.silva@oboticario.com.br',
      password,
      role: 'Gerente de Loja',
      store: 'Shopping Center Norte',
      averageRating: 4.5,
      totalRatings: 12,
    },
    {
      name: 'João Santos',
      email: 'joao.santos@oboticario.com.br',
      password,
      role: 'Coordenador Regional',
      store: 'Região Sul',
      averageRating: 4.2,
      totalRatings: 8,
    },
    {
      name: 'Ana Oliveira',
      email: 'ana.oliveira@oboticario.com.br',
      password,
      role: 'Supervisora',
      store: 'Shopping Iguatemi',
      averageRating: 4.8,
      totalRatings: 15,
    },
    {
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@oboticario.com.br',
      password,
      role: 'Gerente de Loja',
      store: 'Shopping Morumbi',
      averageRating: 3.9,
      totalRatings: 6,
    },
    {
      name: 'Patrícia Lima',
      email: 'patricia.lima@oboticario.com.br',
      password,
      role: 'Coordenadora de Treinamento',
      store: null,
      averageRating: 4.7,
      totalRatings: 20,
    },
    {
      name: 'Roberto Costa',
      email: 'roberto.costa@oboticario.com.br',
      password,
      role: 'Gerente de Loja',
      store: 'Shopping Vila Olímpia',
      averageRating: 4.0,
      totalRatings: 10,
    },
  ]

  for (const manager of managers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: manager.email },
    })

    if (!existingUser) {
      await prisma.user.create({
        data: manager,
      })
      console.log(`Criado gestor: ${manager.name}`)
    } else {
      console.log(`Gestor já existe: ${manager.name}`)
    }
  }

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
