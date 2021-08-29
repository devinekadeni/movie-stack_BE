import * as User_helper from "@/controllers/User/User.helper"
// @ponicode
describe("User_helper.hashingPassword", () => {
    test("0", async () => {
        await User_helper.hashingPassword("$p3onyycat")
    })

    test("1", async () => {
        await User_helper.hashingPassword("!Lov3MyPianoPony")
    })

    test("2", async () => {
        await User_helper.hashingPassword("NoWiFi4you")
    })

    test("3", async () => {
        await User_helper.hashingPassword("YouarenotAllowed2Use")
    })

    test("4", async () => {
        await User_helper.hashingPassword("accessdenied4u")
    })

    test("5", async () => {
        await User_helper.hashingPassword("")
    })
})

// @ponicode
describe("User_helper.generateExpiryTokenUTC", () => {
    test("0", () => {
        let callFunction: any = () => {
            User_helper.generateExpiryTokenUTC("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            User_helper.generateExpiryTokenUTC(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            User_helper.generateExpiryTokenUTC(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            User_helper.generateExpiryTokenUTC("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            User_helper.generateExpiryTokenUTC(7588892)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            User_helper.generateExpiryTokenUTC(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("User_helper.validateSignUpField", () => {
    test("0", async () => {
        await User_helper.validateSignUpField("email@Google.com", "Jean-Philippe", "YouarenotAllowed2Use")
    })

    test("1", async () => {
        await User_helper.validateSignUpField("user@host:300", "Jean-Philippe", "accessdenied4u")
    })

    test("2", async () => {
        await User_helper.validateSignUpField("user1+user2@mycompany.com", "George", "NoWiFi4you")
    })

    test("3", async () => {
        await User_helper.validateSignUpField("something.example.com", "Edmond", "accessdenied4u")
    })

    test("4", async () => {
        await User_helper.validateSignUpField("something@example.com", "Pierre Edouard", "accessdenied4u")
    })

    test("5", async () => {
        await User_helper.validateSignUpField("", "", "")
    })
})

// @ponicode
describe("User_helper.validateTokenSignIn", () => {
    test("0", async () => {
        await User_helper.validateTokenSignIn("user123")
    })

    test("1", async () => {
        await User_helper.validateTokenSignIn(123)
    })

    test("2", async () => {
        await User_helper.validateTokenSignIn("user-name")
    })

    test("3", async () => {
        await User_helper.validateTokenSignIn("user_name")
    })

    test("4", async () => {
        await User_helper.validateTokenSignIn("username")
    })

    test("5", async () => {
        await User_helper.validateTokenSignIn("")
    })
})
