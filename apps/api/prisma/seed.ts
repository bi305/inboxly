import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'owner@example.com'
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12)

  const user = await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name: 'Owner' },
    update: {}
  })

  const workspace = await prisma.workspace.create({
    data: { name: 'Default Workspace' }
  })

  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER'
    }
  })

  console.log('Seeded user:', email)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
