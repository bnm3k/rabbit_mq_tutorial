const amqp = require("amqplib/callback_api");

const logLevels = ["info", "warn", "error"];
let args = process.argv.slice(2);
args.forEach(arg => {
    if (logLevels.indexOf(arg) === -1)
        throw new Error(`invalid log level: ${arg}`);
});
if (args.length < 1) args = [...logLevels];

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const exchange = "direct_logs";
        channel.assertExchange(exchange, "direct", {
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
                    ` [*] Waiting for messages from [${[...args]}]->[${queue}]`
                );

                args.forEach(logLevel =>
                    channel.bindQueue(queue, exchange, logLevel)
                );

                channel.consume(
                    queue,
                    msg => {
                        if (msg.content)
                            console.log(
                                ` [x] ${
                                    msg.fields.routingKey
                                }->${msg.content.toString()}`
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
