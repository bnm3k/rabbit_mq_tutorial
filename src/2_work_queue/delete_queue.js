const amqp = require("amqplib/callback_api");

const queue = process.argv[2];
if (!queue) throw new Error(`provide queue name`);

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
        if (err) throw err;

        channel.deleteQueue(
            queue,
            { ifUnused: false, ifEmpty: false },
            (err, ok) => {
                if (err) throw err;
                console.log(`delete queue: ${queue}, msgs: ${ok.messageCount}`);
                connection.close();
                process.exit(0);
            }
        );
    });
});
