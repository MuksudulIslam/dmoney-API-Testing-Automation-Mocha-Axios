const { expect } = require("chai");
const axios = require("axios");
const fs = require("fs");
const envData = require("../testConfig/env.json");
const userInfo = require("../testdata/user.json");

describe("Check Balance", () => {
    before(async () => {

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

                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                }
            }
        ).then((res) => res.data)
        console.log(response);
        expect(response.message).contain("Login successfully");

        fs.writeFileSync("testConfig/env.json", JSON.stringify({
            ...envData, Token: response.token
        }))
    })

    it("Check Balance of the Customer 2 Account", async () => {

        const response = await axios.get(`${envData.baseUrl}/transaction/balance/${userInfo[userInfo.length - 1].phone_number}`,
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                    "X-AUTH-SECRET-KEY": envData.partnerKey
                }
            }
        ).then((res) => res.data)
        console.log(response)
    })
})