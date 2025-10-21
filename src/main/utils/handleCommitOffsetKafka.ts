import { KafkaContext } from '@nestjs/microservices';

export const handleCommitOffsetKafka = async (context: KafkaContext) => {
  const consumer = context.getConsumer();
  const topic = context.getTopic();
  const partition = context.getPartition();
  const offset = (Number(context.getMessage().offset) + 1).toString();

  const commitOffsetsParams = { topic, partition, offset };
  await consumer.commitOffsets([commitOffsetsParams]);
};
