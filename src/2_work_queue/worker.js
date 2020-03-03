const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
        if (err) throw err;

        const queue = "task_queue";
        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);
        console.log(
            ` [*] Waiting for messages in ${queue}. To exit press CTRL+C`
        );

        channel.consume(
            queue,
            msg => {
                const task = JSON.parse(msg.content.toString());
                console.log("received: %j", task);
                setTimeout(() => {
                    console.log(`done: n^2 = ${task.n * task.n}`);
                    channel.ack(msg);
                }, 6000);
            },
            { noAck: false }
        );

        // setTimeout(() => {
        //     connection.close();
        //     process.exit(0);
        // }, 500);
    });
});
