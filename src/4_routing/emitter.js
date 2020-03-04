const amqp = require("amqplib/callback_api");

const levels = ["info", "warn", "error"];
const logMsg = process.argv[2] || `some log message: [${Date.now()}]`;
const logLevel = process.argv[3] || "info";
if (levels.indexOf(logLevel) < 0)
    throw new Error(`Invalid log level ${logLevel}`);

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        const exchange = "direct_logs";
        channel.assertExchange(exchange, "direct", { durable: false });

        channel.publish(exchange, logLevel, Buffer.from(logMsg));
        console.log(` [x] Sent ${logMsg}->${logLevel}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
