const { expect } = require("chai");
const axios = require("axios");
const fs = require("fs");
const envData = require("../testConfig/env.json");
const transac = require("../testdata/transaction.json");
const userInfo = require("../testdata/user.json");

describe("Send Money Customer To Customer", () => {

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

        fs.writeFileSync("testConfig/env.json", JSON.stringify({
            ...envData, Token: response.token
        }))
    })

    it("Send Money From Customer 1 Account to the Newly Created Another Customer 2 Account", async () => {

        const customer1PhoneNum = userInfo[userInfo.length - 2].phone_number;
        const customer2PhoneNum = userInfo[userInfo.length - 1].phone_number;
        const Amount = 500;

        const response = await axios.post(`${envData.baseUrl}/transaction/sendmoney`,
            {

                from_account: customer1PhoneNum,
                to_account: customer2PhoneNum,
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

        expect(response.message).contain("Send money successful");

        const trnxID = response.trnxId;
        const fee = response.fee;
        const balance = response.currentBalance;

        const newtranObj =
        {

            from_Account: customer1PhoneNum,
            to_Account: customer2PhoneNum,
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