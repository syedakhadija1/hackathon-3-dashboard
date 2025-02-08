export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "sk97tpSJfpZRUK4zeTabFluulMmbNWj7CetasgRjkmEi4JXsAUiQyY8trGa7NxsVBs8g7BovQ48XoBTd3mqIdTMdKxqq3QyzW14FayqNBzMisIQdo6S26jOOckFip5okMMKr0fXeFN9QT9eeRdmJjZlOC8CdrRPvQLK771CNRKdHXHVgxoT1",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
