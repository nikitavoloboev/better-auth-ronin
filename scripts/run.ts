import { get, add } from "ronin"

async function main() {
  // await createUser()
  await run()
}
await main()
console.log("done")

async function createUser() {
  // @ts-ignore
  const user = await add.user.with({
    email: "nikita@nikiv.dev",
    username: "nikiv",
  })
  console.log(user)
}

async function run() {
  // const users = await get.users()
  // console.log(users)

  const user = await get.user({
    with: {
      username: "nikivi",
    },
  })
  console.log(user)
}
