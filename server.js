require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const path = require('path');
const nodemailer = require('nodemailer');

// 1. Роздача статики з папки public/ [cite: 239]
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/', 
});

// 2. Головна сторінка за шляхом GET / [cite: 240]
fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

// 3. Ендпоінт для форми зворотного зв'язку [cite: 242]
fastify.post('/api/contact', async (request, reply) => {
    const { name, email, subject, message } = request.body;

    // Базова валідація [cite: 243]
    if (!name || !email || !subject || !message) {
        return reply.status(400).send({ error: 'Всі поля обов’язкові!' });
    }
    if (!email.includes('@')) {
        return reply.status(400).send({ error: 'Некоректний email' });
    }

    // Налаштування Nodemailer + Mailjet SMTP 
    let transporter = nodemailer.createTransport({
        host: "in-v3.mailjet.com",
        port: 587,
        auth: {
            user: process.env.MAILJET_API_KEY,
            pass: process.env.MAILJET_SECRET_KEY,
        },
    });

    try {
        // Відправка листа на твою пошту [cite: 244]
        await transporter.sendMail({
            from: `"Сайт-Резюме" <${process.env.MY_EMAIL}>`, 
            to: process.env.MY_EMAIL, 
            subject: `Нове повідомлення: ${subject}`,
            text: `Від: ${name} (${email})\n\nПовідомлення:\n${message}`,
        });

        return { success: true, message: 'Лист успішно надіслано!' };
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Помилка відправки' });
    }
});

// Запуск сервера
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Сервер запущено: http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();