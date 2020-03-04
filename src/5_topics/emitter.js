const amqp = require("amqplib/callback_api");

//const keys = ["info", "warn", "error"];
const key = process.argv[2] || "foo.bar";
const msg = process.argv.slice(3).join(" ") || `some message: [${Date.now()}]`;
//if (key.indexOf(key) < 0) throw new Error(`Invalid key ${key}`);

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const exchange = "topic_logs";
        channel.assertExchange(exchange, "topic", { durable: false });

        channel.publish(exchange, key, Buffer.from(msg));
        console.log(` [x] Sent ${msg}->${key}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
