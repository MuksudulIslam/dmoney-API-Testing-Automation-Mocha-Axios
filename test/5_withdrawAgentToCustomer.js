const { expect } = require("chai");
const axios = require("axios");
const envData = require("../testConfig/env.json");
const fs = require("fs");
const transac = require("../testdata/transaction.json");
const userInfo = require("../testdata/user.json");

describe("Withdraw Money From Agent To Customer", () => {
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
                    "Authorization": envData.Token
                }
            }
        ).then((res) => res.data)

        console.log(response);
        expect(response.message).contain("Login successfully");

        fs.writeFileSync("testConfig/env.json", JSON.stringify({
            ...envData, Token: response.token
        }))
    })

    it("Withdraw Money From the Created Agent by the Customer 1 Account", async () => {

        const agentPhoneNum = userInfo[userInfo.length - 3].phone_number;
        const customer1PhoneNum = userInfo[userInfo.length - 2].phone_number;
        const Amount = 500;

        const response = await axios.post(`${envData.baseUrl}/transaction/withdraw`,
            {

                from_account: customer1PhoneNum,
                to_account: agentPhoneNum,
                amount: Amount
            },
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                    "X-AUTH-SECRET-KEY": envData.partnerKey
                }

            }
        ).then((res) => res.data)
        console.log(response);
        expect(response.message).contain("Withdraw successful");

        const trnxID = response.trnxId;
        const fee = response.fee;
        const balance = response.currentBalance;

        const newtranObj =
        {

            from_Account: customer1PhoneNum,
            to_Account: agentPhoneNum,
            transcation_amount: Amount,
            tranXId: trnxID,
            fee: fee,
            currentBalance: balance
        }

        transac.push(newtranObj);

        fs.writeFileSync("testdata/transaction.json", JSON.stringify(transac))
        console.log("Saved! Successfully.");


    })
})