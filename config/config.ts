export const getRequireEnv = (envName: string): string => {
  const value = process.env[envName]
  if (!value) {
    throw new Error(`Environment variable ${envName} is required`)
  }
  return value
}