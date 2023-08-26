import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import AddSecure from '../utils/addSecure';

const prisma = new PrismaClient();

function generateShortUrl() {
    return uuidv4().substring(0, 8);
}

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post('/shorten', async (request, reply) => {
        const { originalUrl } = request.body as any;

        const existingUrl = await prisma.shortenedUrl.findUnique({
            where: { original: AddSecure(originalUrl) },
        });

        if (existingUrl) {
            reply.send({ shortUrl: existingUrl.short });
        } else {
            const hash = generateShortUrl();
            const newShortUrl = `${process.env.HOST_URL}/${hash}`;

            await prisma.shortenedUrl.create({
                data: {
                    original: AddSecure(originalUrl),
                    short: newShortUrl,
                },
            });
            reply.send({ shortUrl: newShortUrl });
        }
    });

    fastify.get('/:shortUrl', async (request, reply) => {
        const { shortUrl } = request.params as any;



        const urlEntry = await prisma.shortenedUrl.findFirst({
            where: {
                short: `${process.env.HOST_URL}/${shortUrl}`
            }
        });

        if (urlEntry) {
            reply.redirect(urlEntry.original);
        } else {
            reply.code(404).send('URL not found');
        }
    });

    fastify.get('/urls', async (request, reply) => {
        const urls = await prisma.shortenedUrl.findMany();
        reply.code(200).send(urls);
    });
};

export default root;
