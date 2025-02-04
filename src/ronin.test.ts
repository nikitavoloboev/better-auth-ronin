import { betterAuth } from "better-auth"
import { afterAll, describe, expect, it } from "bun:test"
import { roninAdapter } from "."
import { username } from 'better-auth/plugins/username'
import { remove } from "ronin"
import { bearer } from "better-auth/plugins"


describe("ronin", () => {
    const auth = betterAuth({
        database: roninAdapter(),
        emailAndPassword: {
            enabled: true
        },
        plugins: [username(), bearer()],
    })

    let userDetails = {
        id: "",
        email: "test3@email.com",
        password: 'password',
        name: 'Test User',
        username: 'test_user3'
    }

    afterAll(async () => {
        await remove.session.with({ userId: userDetails.id })
        await remove.account.with({ userId: userDetails.id })
        await remove.user.with({ email: userDetails.email })
    })

    it("sign up email", async () => {
        const user = await auth.api.signUpEmail({
            body: userDetails
        })
        userDetails.id = user.user.id
    })

    let token = ""
    it("sign in email", async () => {
        const result = await auth.api.signInEmail({
            body: {
                email: userDetails.email,
                password: userDetails.password
            }
        })
        token = result.token
    })

    it("sign in username", async () => {
        const result = await auth.api.signInUsername({
            body: {
                username: userDetails.username,
                password: userDetails.password
            }
        })
        expect(result?.user.id).toBe(userDetails.id)
        expect(result?.user.id).toBe(userDetails.id)
    })


    it("should get session", async () => {
        const session = await auth.api.getSession({
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        })
        expect(session?.user).toBeDefined()
        expect(session?.session?.userId).toBe(userDetails.id)
    })

    it("should revoke session", async () => {
        const revoked = await auth.api.revokeSession({
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
            body: {
                token
            }
        })
        expect(revoked.status).toBe(true);
        const session = await auth.api.getSession({
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        })
        expect(session).toBe(null)
    })
})