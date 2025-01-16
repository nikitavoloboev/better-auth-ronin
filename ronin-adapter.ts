import { BetterAuthError } from "better-auth"
import type { FieldAttribute } from "better-auth/db"
import { getAuthTables } from "better-auth/db"
import type { Adapter, BetterAuthOptions } from "better-auth/types"
import { get, create } from "ronin"

// https://github.com/better-auth/better-auth/blob/36b490a80b187ae92d632ecf23bd1ee918d3e753/packages/better-auth/src/adapters/utils.ts#L3C8-L20C2
function withApplyDefault(
  value: unknown,
  field: FieldAttribute,
  action: "create" | "update",
) {
  if (action === "update") return value

  if (value === undefined || value === null)
    if (field.defaultValue) {
      if (typeof field.defaultValue === "function") return field.defaultValue()

      return field.defaultValue
    }

  return value
}

function createTransform(options: BetterAuthOptions) {
  const schema = getAuthTables(options)
  return {}
}

// making use of https://github.com/ronin-co/client
// unclear what should be put in the methods
export function roninAdapter(db: unknown) {
  return (options: BetterAuthOptions) => {
    const {} = createTransform(options)
    return {
      id: "ronin",
      create: async ({ data, model, select }) => {
        // await create.
        throw new BetterAuthError("Not implemented")
      },
      findOne: async ({ model, select, where }) => {
        throw new BetterAuthError("Not implemented")
      },
      findMany: async ({ limit, model, offset, sortBy, where }) => {
        throw new BetterAuthError("Not implemented")
      },
      update: async ({ model, update, where }) => {
        throw new BetterAuthError("Not implemented")
      },
      delete: async ({ model, where }) => {
        throw new BetterAuthError("Not implemented")
      },
      deleteMany: async ({ model, where }) => {
        throw new BetterAuthError("Not implemented")
      },
      updateMany({ model, update, where }) {
        throw new BetterAuthError("Not implemented")
      },
    } satisfies Adapter
  }
}
