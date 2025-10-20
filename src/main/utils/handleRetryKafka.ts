import { Logger } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Message } from 'kafkajs';

const MAX_RETRIES = 5;
const DLQ_TOPIC = 'dlq';

export const handleRetryKafka = async (context: KafkaContext, error: Error, logger: Logger) => {
  const actualMessage = context.getMessage();

  const consumer = context.getConsumer();
  const producer = context.getProducer();

  const topic = context.getTopic();
  const partition = context.getPartition();
  const offset = String(Number(context.getMessage().offset) + 1);

  const commitOffsetsParams = { topic, partition, offset };
  const currentRetryAttempt = Number(actualMessage.headers?.retryAttempt);

  await consumer.commitOffsets([commitOffsetsParams]);

  if (currentRetryAttempt === MAX_RETRIES) {
    logger.log('Enviando Mensagem para DLQ');
    await producer.send({
      topic: DLQ_TOPIC,
      messages: [
        {
          headers: {
            ...actualMessage.headers,
            error: JSON.stringify(actualMessage.headers!.error),
          },
          value: JSON.stringify(actualMessage.value),
        },
      ],
    });
  } else {
    logger.log('Tentando Reprocessar Mensagem...');
    const retryAttempt = currentRetryAttempt ? currentRetryAttempt + 1 : 1;
    const newMessage: Message = {
      value: JSON.stringify(actualMessage.value),
      headers: {
        retryAttempt: retryAttempt.toString(),
        dateLastError: new Date().toISOString(),
        topic,
        offset,
        partition: partition.toString(),
        error: JSON.stringify({
          message: error.message,
          stack: error.stack,
          cause: error.cause,
          name: error.name,
        }),
      },
    };

    await producer.send({
      topic,
      messages: [newMessage],
    });
  }
};
