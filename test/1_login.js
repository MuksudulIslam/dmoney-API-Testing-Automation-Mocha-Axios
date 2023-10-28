const { expect } = require("chai");
const axios = require("axios");
const envData = require("../testConfig/env.json");
const fs = require("fs");
const userInfo = require("../testdata/user.json")

describe("Login", () => {
    it("Admin Login With Valid Credentials", async () => {

        const userName = userInfo[0].username;
        const password = userInfo[0].password;

        const response = await axios.post(`${envData.baseUrl}/user/login`,
            {
                email: userName,
                password: password
            },
            {
                headers:
                {
                    "Content-Type": "application/json"
                }
            }
        ).then((res) => res.data)
        console.log(response);
        expect(response.message).contain("Login successfully");

        fs.writeFileSync("testConfig/env.json", JSON.stringify({
            ...envData, Token: response.token
        }))
    })
})