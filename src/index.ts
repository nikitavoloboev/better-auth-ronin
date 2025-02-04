import type { Adapter, BetterAuthOptions, Where } from "better-auth/types"
import { add, get, set, remove } from "ronin"

function operatorToRoninOperator(operator: string) {
  switch (operator) {
    case "starts_with":
      return "startingWith"
    case "ends_with":
      return "endingWith"
    case "lte":
      return "lessOrEqual"
    case "gte":
      return "greaterOrEqual"
    case "gt":
      return "greaterThan"
    case "lt":
      return "lessThan"
    default:
      return operator
  }
}

function convertWhereClause(where?: Where[]) {
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

  if (and) {
    return and.map((w) => {
      return {
        [w.field]:
          w.operator === "eq" || !w.operator
            ? w.value
            : {
              [operatorToRoninOperator(w.operator)]: w.value,
            },
      }
    })
  }

  return or.map((w) => {
    return {
      [w.field]:
        w.operator === "eq" || !w.operator
          ? w.value
          : {
            [operatorToRoninOperator(w.operator)]: w.value,
          },
    }
  })
}

export function roninAdapter() {
  return (options: BetterAuthOptions) => {
    return {
      id: "ronin",
      create: async ({ data, model }) => {
        // @ts-ignore
        return await add[model].with(data)
      },
      findOne: async ({ model, select, where }) => {
        const convertedWhereClause = convertWhereClause(where)
        const result = await get[model].with(convertedWhereClause)
        if (Array.isArray(result)) {
          return result[0] as any
        }
        return result as any
      },
      findMany: async ({ limit, model, offset, sortBy, where }) => {
        const convertedWhereClause = convertWhereClause(where)
        const result = where?.length ? await get[`${model}s`].with(convertedWhereClause) : await get[model]()
        return result as any
      },
      update: async ({ model, update, where }) => {
        const convertedWhereClause = convertWhereClause(where)
        const result = await set[model]({
          with: convertedWhereClause,
          to: update
        })
        return result as any
      },
      delete: async ({ model, where }) => {
        const convertedWhereClause = convertWhereClause(where)
        await remove[model].with(convertedWhereClause)
      },
      deleteMany: async ({ model, where }) => {
        const convertedWhereClause = convertWhereClause(where)
        const result = await remove[model].with(convertedWhereClause)
        return 1
      },
      async updateMany({ model, update, where }) {
        const convertedWhereClause = convertWhereClause(where)
        const result = await set[model]({
          with: convertedWhereClause,
          to: update
        })
        return result as any
      },
    } satisfies Adapter
  }
}

