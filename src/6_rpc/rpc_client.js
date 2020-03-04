const amqp = require("amqplib/callback_api");
const cuid = require("cuid");

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;

    connection.createChannel((err, channel) => {
        if (err) throw err;

        channel.assertQueue(
            "",
            {
                exclusive: true
            },
            function(err, { queue }) {
                if (err) throw err;

                const correlationId = cuid();
                const num = parseInt(process.argv[2] || 1, 10);

                console.log(` [x] Requesting fib(${num})`);

                channel.consume(
                    queue,
                    msg => {
                        if (msg.properties.correlationId === correlationId) {
                            console.log(` [.] Got ${msg.content.toString()}`);
                            setTimeout(() => {
                                connection.close();
                                process.exit(0);
                            }, 500);
                        }
                    },
                    {
                        noAck: true
                    }
                );

                channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
                    correlationId,
                    replyTo: queue
                });
            }
        );
    });
});
