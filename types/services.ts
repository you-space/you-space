export interface TypeItemCreate {
  sourceId?: string
  value: any
}

export interface Types {
  create(name: string, schema: string): Promise<any>
  delete(name: string): Promise<void>
  createItems(name: string, items: TypeItemCreate[]): Promise<void>
}
