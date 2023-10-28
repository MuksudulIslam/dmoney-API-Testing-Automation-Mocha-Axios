const { expect } = require("chai");
const axios = require("axios");
const fs = require("fs");
const envData = require("../testConfig/env.json");
const transac = require("../testdata/transaction.json");
const userInfo = require("../testdata/user.json");
const { en } = require("@faker-js/faker");

describe("Payment Customer To Merchant", () => {
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

    it("Payment Money From Created Customer 2 Account to the Merchant Account", async () => {

        const customer2PhoneNum = userInfo[userInfo.length - 1].phone_number;
        const merchantPhoneNum = userInfo[1].phone_number;
        const Amount = 100;

        const response = await axios.post(`${envData.baseUrl}/transaction/payment`,
            {
                from_account: customer2PhoneNum,
                to_account: merchantPhoneNum,
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
        expect(response.message).contain("Payment successful");

        const trnxID = response.trnxId;
        const fee = response.fee;
        const balance = response.currentBalance;

        const newtranObj =
        {
            from_account: customer2PhoneNum,
            to_account: merchantPhoneNum,
            transcation_amount: Amount,
            tranXId: trnxID,
            fee: fee,
            currentBalance: balance

        }

        transac.push(newtranObj);
        fs.writeFileSync("testdata/transaction.json", JSON.stringify(transac));
        console.log("Saved! Successfully.");
    })
})