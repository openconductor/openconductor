import * as activities from '@openconductor/activities';
import { getConnectionOptions, namespace, taskQueue } from '@openconductor/config-temporal';
import { NativeConnection, Worker } from '@temporalio/worker';
if (process.env.ENVIRONMENT === 'local') {
  // fake import for workflow files, so locally tsx restarts on file changes
  await import('@openconductor/workflows');
}

const workflowsPath = new URL('../node_modules/@openconductor/workflows', import.meta.url).pathname;

async function run() {
  const connection = await NativeConnection.connect(getConnectionOptions());
  const worker = await Worker.create({
    workflowsPath: workflowsPath,
    activities,
    connection,
    namespace,
    taskQueue,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
