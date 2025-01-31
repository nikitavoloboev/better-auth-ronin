import { BetterAuthError } from "better-auth"
import type { Adapter, BetterAuthOptions, Where } from "better-auth/types"
import { create } from "ronin"

function operatorToRoninOperator(operator: string) {
  switch (operator) {
    case "starts_with":
      return "startsWith"
    case "ends_with":
      return "endsWith"
    default:
      return operator
  }
}

function convertWhereClause(model: string, where?: Where[]) {
  if (!where) return {}
  if (where.length === 1) {
    const w = where[0]
    if (!w) {
      return
    }
    return {
      [w.field]:
        w.operator === "eq" || !w.operator
          ? w.value
          : {
              [operatorToRoninOperator(w.operator)]: w.value,
            },
    }
  }
  const and = where.filter((w) => w.connector === "AND" || !w.connector)
  const or = where.filter((w) => w.connector === "OR")
  const andClause = and.map((w) => {
    return {
      [w.field]:
        w.operator === "eq" || !w.operator
          ? w.value
          : {
              [operatorToRoninOperator(w.operator)]: w.value,
            },
    }
  })
  const orClause = or.map((w) => {
    return {
      [w.field]: {
        [w.operator || "eq"]: w.value,
      },
    }
  })

  return {
    ...(andClause.length ? { AND: andClause } : {}),
    ...(orClause.length ? { OR: orClause } : {}),
  }
}

export function roninAdapter(db: unknown) {
  return (options: BetterAuthOptions) => {
    return {
      id: "ronin",
      create: async ({ data, model }) => {
        // @ts-ignore
        return await create[model].with(data)
        // throw new BetterAuthError("Not implemented")
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

// TODO: untyped until ronin adds types to new client
