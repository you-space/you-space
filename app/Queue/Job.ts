export class Job<T = any> {
  public id: string
  public queue: string
  public description?: string
  public args: T
  public status: 'pending' | 'done' | 'failed' | 'active'
  public logs: string[] = []
  public error: any = null

  constructor(data: Partial<Job>) {
    Object.assign(this, data)
  }
}
