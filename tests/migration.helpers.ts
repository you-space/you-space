import execa from 'execa'

export async function runMigrations() {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

export async function rollbackMigrations() {
  await execa.node('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}
