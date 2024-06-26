function createPushNotificationsJobs (jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }
  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code', jobData);
    job.save((error) => {
      if (error) {
        console.error(`Failed to create job: ${error}`);
      } else {
        console.log(`Notification job created: ${job.id}`);
        job.on('complete', () => console.log(`Notification job ${job.id} completed`))
          .on('failed', error => console.log(`Notification job ${job.id} failed: ${error}`))
          .on('progress', (progress, data) => console.log(`Notification job ${job.id} ${progress}% complete`));
      }
    });
  });
}
export default createPushNotificationsJobs;
