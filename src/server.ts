import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { PrismaClient } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({ log: ['query'] });
const PORT = 3333;

async function bootstrap() {
  const fastify = Fastify({
    logger: true, //Gera log de todas as ocorrências na aplicação
  });

  await fastify.register(cors, {
    origin: true
  });

  fastify.get('/pools/count', async () => {
    const pools = await prisma.pool.count();

    return { pools };
  });

  fastify.get('/users/count', async () => {
    const users = await prisma.user.count();

    return { users };
  });

  fastify.get('/guesses/count', async () => {
    const guesses = await prisma.guess.count();

    return { guesses };
  });

  fastify.post('/pools', async (req, res) => {
    const createPoolBody = z.object({
      title: z.string()
    })

    const { title } = createPoolBody.parse(req.body);

    if (!title) {
      return res.status(400).send({message: "O título é obrigatório"});
    }

    const generateUniqueId = new ShortUniqueId({ length: 6 })
    const code = String(generateUniqueId()).toUpperCase();

    await prisma.pool.create({
      data: {
        title,
        code
      }
    })

    return res.status(201).send({ code });
  });

  await fastify.listen({port: PORT, /*host: '0.0.0.0'*/});
};

bootstrap();