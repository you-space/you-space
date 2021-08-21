export function isJson(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export async function requireIfExist(path: string) {
  try {
    return require(path)
  } catch (error) {
    return null
  }
}
