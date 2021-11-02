import { Job, Queue } from 'App/Queue'
import Space from 'App/Services/SpaceService'
import test from 'japa'
import faker from 'faker'
import Sinon from 'sinon'

interface IndexResult {
  meta: any
  data: Job[]
}

test.group('JobLister (int)', (group) => {
  const queueName = faker.random.word()
  const worker = Sinon.stub().resolves(true)

  group.beforeEach(() => {
    if (Queue.queues.has(queueName)) {
      Queue.queues.get(queueName)?.kill()
      Queue.queues.delete(queueName)
    }

    Queue.addQueue(queueName, worker)
    Queue.jobs.clear()
  })

  function createJobs(length = 5, queue = queueName) {
    Array.from({ length }).forEach(() => Queue.addJob({ queue }))

    return Array.from(Queue.jobs.values())
  }

  test('[job:index] should return a list of jobs', async (assert) => {
    const jobs = createJobs()

    const result = await Space.emit<IndexResult>('job:index')

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(jobs, result.data)
  })

  test('[job:show] should return a job by id', async (assert) => {
    const [job] = createJobs(1)

    const result = await Space.emit<Job>('job:show', job.id)

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(job, result)
  })

  test('[job:destroy] should remove a job by id', async (assert) => {
    const [job] = createJobs(5)

    await new Promise<void>((resolve) => setTimeout(resolve, 50))

    await Space.emit<Job>('job:destroy', job.id)

    assert.deepEqual(Queue.jobs.has(job.id), false)
  })

  test('[job:destroy] should trigger a error if job was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<Job>('job:destroy', 1).catch((error) => {
      assert.equal(error.message, 'Job not found')
    })
  })

  test('[job:destroy] should trigger a error if job is active', async (assert) => {
    assert.plan(1)

    Queue.addQueue('teste', () => new Promise<void>((resolve) => setTimeout(resolve, 500)))

    const [job] = createJobs(1, 'teste')

    await Space.emit('job:destroy', job.id).catch((error) => {
      assert.equal(error.message, 'Cannot delete active jobs')
    })
  })
})
