const amqp = require("amqplib/callback_api");

const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

const genMsg = () => ({ ts: Date.now(), n: randInt(0, 100) });

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
        if (err) throw err;
        const queue = "task_queue";

        channel.assertQueue(queue, {
            durable: true
        });

        const msg = genMsg();
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
            persistent: true
        });
        console.log(`[x] Sent:\n${JSON.stringify(msg, null, 4)}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
