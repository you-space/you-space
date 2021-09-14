import { api } from 'src/boot/axios';

export interface Job {
    id: string;
    name: string;
    queueName: string;
    status: string;
}

export type JobActions = 'cancel' | 'delete';

export async function fetchJobs() {
    const { data } = await api.get('/admin/jobs');
    return data;
}

export async function updateJobs(action: JobActions, jobs: Job[]) {
    const { data } = await api.patch('/admin/jobs', {
        action,
        jobs: jobs.map((job) => ({
            jobId: job.id,
            queueName: job.queueName,
        })),
    });

    return data;
}
