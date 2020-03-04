const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const exchange = "logs";
        channel.assertExchange(exchange, "fanout", {
            durable: false
        });

        channel.assertQueue(
            "",
            {
                exclusive: true
            },
            (err, { queue }) => {
                if (err) throw error2;

                console.log(` [*] Waiting for messages in [${queue}]`);
                channel.bindQueue(queue, exchange, "");

                channel.consume(
                    queue,
                    msg => {
                        if (msg.content)
                            console.log(` [x] ${msg.content.toString()}`);
                    },
                    {
                        noAck: true
                    }
                );
            }
        );
    });
});
