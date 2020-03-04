const amqp = require("amqplib/callback_api");

const fib = n =>
    Number.isNaN(n) ? NaN : n === 0 || n === 1 ? n : fib(n - 1) + fib(n - 2);

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const queue = "rpc_queue";
        channel.assertQueue(queue, { durable: false });
        channel.prefetch(1);

        console.log(` [x] Waiting for RPC requests`);

        channel.consume(queue, msg => {
            const { properties, content } = msg;
            const base = 10;
            const n = parseInt(content.toString(), base);

            const { replyTo, correlationId } = properties;
            console.log(` [${correlationId}] -> recvd fib(${n})`);
            const result = fib(n);
            console.log(` [${correlationId}] -> cmplt fib(${n})`);

            channel.sendToQueue(replyTo, Buffer.from(result.toString()), {
                correlationId
            });

            channel.ack(msg);
        });
    });
});
