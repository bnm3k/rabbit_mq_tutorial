const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
        if (err) throw err;

        const queue = "hello";
        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(
            queue,
            msg => {
                console.log(` [x] Received ${msg.content.toString()}`);
            },
            { noAck: true }
        );

        // setTimeout(() => {
        //     connection.close();
        //     process.exit(0);
        // }, 500);
    });
});
