const amqp = require("amqplib/callback_api");

let keys = process.argv.slice(2);
if (keys.length < 1) keys = ["#"]; //listen to all

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const exchange = "topic_logs";
        channel.assertExchange(exchange, "topic", {
            durable: false
        });

        channel.assertQueue(
            "",
            {
                exclusive: true
            },
            (err, { queue }) => {
                if (err) throw error2;

                console.log(
                    ` [*] Waiting for messages: [${queue}], keys: [${[
                        ...keys
                    ]}]`
                );

                keys.forEach(key => channel.bindQueue(queue, exchange, key));

                channel.consume(
                    queue,
                    msg => {
                        if (msg.content)
                            console.log(
                                ` [x] ${
                                    msg.fields.routingKey
                                }->"${msg.content.toString()}"`
                            );
                    },
                    {
                        noAck: true
                    }
                );
            }
        );
    });
});
