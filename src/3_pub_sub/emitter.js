const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const exchange = "logs";
        channel.assertExchange(exchange, "fanout", { durable: false });

        const msg = process.argv[2] || `some log message: [${Date.now()}]`;
        channel.publish(exchange, "", Buffer.from(msg));
        console.log(` [x] Sent ${msg}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
