import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(){
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe03@gmail.com',
      avatarUrl: "https://github.com/Gleydson07.png",
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: "Bolão do Racha dos complexados",
      code: "RCCPLX",
      ownerId: user.id
    }
  })

  const participant = await prisma.participant.create({
    data: {
      poolId: pool.id,
      userId: user.id
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-29T14:00:00.500Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'DE'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-12-02T14:00:00.500Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,

          participant: {
            create: {
              userId:  user.id,
              poolId: pool.id
            }
          }
        }
      }
    }
  })
}

main();