const { expect } = require("chai");
const axios = require("axios");
const envData = require("../testConfig/env.json");
const fs = require("fs");
const transac = require("../testdata/transaction.json");
const userInfo = require("../testdata/user.json");

describe("Deposite Money System To Agent", () => {
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

    it("Deposit Money From System Account to Newly Created Agent Account", async () => {
        const systemAccount = "SYSTEM";
        const agentPhoneNum = userInfo[userInfo.length - 3].phone_number;
        const Amount = 2000;

        const response = await axios.post(`${envData.baseUrl}/transaction/deposit`,
            {

                from_account: systemAccount,
                to_account: agentPhoneNum,
                amount: Amount
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                    "X-AUTH-SECRET-KEY": envData.partnerKey
                }
            }

        ).then((res) => res.data)

        console.log(response);
        expect(response.message).contain("Deposit successful");

        const trnxID = response.trnxId;
        const com = response.commission;
        const balnace = response.currentBalance;

        const newtranObj =
        {
            from_Account: systemAccount,
            to_Account: agentPhoneNum,
            transcation_amount: Amount,
            tranXId: trnxID,
            commission: com,
            currentBalance: balnace
        };

        transac.push(newtranObj);

        fs.writeFileSync("testdata/transaction.json", JSON.stringify(transac))
        console.log("Saved! Successfully.")
    })
})