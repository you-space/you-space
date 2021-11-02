import { Job } from 'App/Queue/Job'

async function worker(job: Job) {
  return Promise.resolve(job.args)
}

export default worker
