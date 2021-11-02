import { Queue } from 'App/Queue'
import test from 'japa'
import Sinon from 'sinon'
import faker from 'faker'

test.group('QueueService (unit)', (group) => {
  let queueName = faker.random.word()

  group.beforeEach(() => {
    Queue.queues.delete(queueName)
    Queue.jobs.clear()
  })

  test('[start] should queues start with application', (assert) => {
    assert.equal(Queue.booted, true)
  })

  test('[addQueue] should add a new queue', (assert) => {
    const worker = Sinon.stub().resolves(true)

    Queue.addQueue(queueName, worker)

    assert.equal(Queue.queues.has(queueName), true)
  })

  test('[addQueue] should trigger a error if queue already exist', (assert) => {
    const worker = Sinon.stub().resolves(true)

    Queue.addQueue(queueName, worker)

    assert.throws(() => Queue.addQueue(queueName, worker), `Queue ${queueName} already exists`)
  })

  test('[workerMiddleware] should not call worker if job was deleted', (assert) => {
    const worker = Sinon.stub().resolves(true)

    const queue = Queue.addQueue(queueName, worker)

    queue.pause()

    Queue.addJob({
      jobId: 'teste',
      queue: queueName,
    })

    Queue.jobs.delete('teste')

    queue.resume()

    assert.equal(worker.notCalled, true)
  })

  test('[addJob] should add a job', () => {
    const worker = Sinon.stub().resolves(true)

    Queue.addQueue(queueName, worker)

    Queue.addJob({
      jobId: 'teste',
      queue: queueName,
      args: { hello: 'word' },
    })

    Sinon.assert.calledWithMatch(worker, {
      args: { hello: 'word' },
    })
  })

  test('[addJob] should trigger a error if jobId already exist', (assert) => {
    const worker = Sinon.stub().resolves(true)

    Queue.addQueue(queueName, worker)

    const options = {
      jobId: 'teste',
      queue: queueName,
    }

    Queue.addJob(options)

    assert.throw(() => Queue.addJob(options), `Job ${options.jobId} already exists`)
  })

  test('[addJob] should trigger a error queue not exist', (assert) => {
    const options = {
      jobId: 'teste',
      queue: queueName,
    }

    assert.throw(() => Queue.addJob(options), `Queue ${options.queue} does not exist`)
  })

  test('[addJob] should set job status to done when finish', async (assert) => {
    const worker = Sinon.stub().resolves(true)

    Queue.addQueue(queueName, worker)

    const id = Queue.addJob({ queue: queueName })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const job = Queue.jobs.get(id)

    assert.equal(job?.status, 'done')
  })

  test('[addJob] should set job status to failed when a error happen', async (assert) => {
    const worker = Sinon.stub().rejects(new Error('error in job'))

    Queue.addQueue(queueName, worker)

    const id = Queue.addJob({ queue: queueName })

    await new Promise((resolve) => setTimeout(resolve, 50))

    const job = Queue.jobs.get(id)

    assert.equal(job?.status, 'failed')
    assert.equal(job?.error, 'error in job')
  })
})
