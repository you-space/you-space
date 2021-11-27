declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    numberArray(): Rule
    fileExist(basePath?: string): Rule
  }
}
