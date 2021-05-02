export function pickObject(
  obj: { [key: string]: any },
  param: string[]
): { [key: string]: any } {
  if (!param?.length) {
    return {}
  }

  return param.reduce((acc, val) => {
    return { ...acc, [val]: obj[val] }
  }, {})
}
