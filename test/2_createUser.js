const { expect } = require("chai");
const axios = require("axios");
const envData = require("../testConfig/env.json");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const randomNum = require("../utils/randomNumberGenerate");
const userInfo = require("../testdata/user.json");

describe("Create Users", () => {
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

    it("Admin Create an Agent Account", async () => {
        const Name = faker.person.fullName();
        const Email = faker.internet.email();
        const phone = "0152" + randomNum(9999999, 1111111);
        const nid = "12" + randomNum(99999999, 11111111);
        const Role = "Agent";
        const pass = "1234";

        const response = await axios.post(`${envData.baseUrl}/user/create`,
            {
                name: Name,
                email: Email,
                password: pass,
                phone_number: phone,
                nid: nid,
                role: Role,
            },
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                    "X-AUTH-SECRET-KEY": envData.partnerKey,
                }
            }
        ).then((res) => res.data.user);
        console.log(response);

        const name = response.name;
        const phoneNum = response.phone_number;
        const role = response.role;

        const newUserObj =
        {

            name: name,
            phone_number: phoneNum,
            role: role,
        };

        userInfo.push(newUserObj);

        fs.writeFileSync("testdata/user.json", JSON.stringify(userInfo));
        console.log("Saved! Successfully.");
    });

    it("Admin Create a Customer Account", async () => {
        const Name = faker.person.fullName();
        const Email = faker.internet.email();
        const phone = "0152" + randomNum(9999999, 1111111);
        const nid = "12" + randomNum(99999999, 11111111);
        const pass = "1234";
        const Role = "Customer";

        const response = await axios.post(`${envData.baseUrl}/user/create`,
            {
                name: Name,
                email: Email,
                password: pass,
                phone_number: phone,
                nid: nid,
                role: Role,
            },
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                    "X-AUTH-SECRET-KEY": envData.partnerKey,
                },
            }
        ).then((res) => res.data.user);
        console.log(response);

        const name = response.name;
        const phoneNum = response.phone_number;
        const role = response.role;

        const newUserObj =
        {

            name: name,
            phone_number: phoneNum,
            role: role,
        };

        userInfo.push(newUserObj);

        fs.writeFileSync("testdata/user.json", JSON.stringify(userInfo));
        console.log("Saved! Successfully.");
    });

    it("Admin Create Another Customer Account", async () => {
        const Name = faker.person.fullName();
        const Email = faker.internet.email();
        const phone = "0152" + randomNum(9999999, 1111111);
        const nid = "12" + randomNum(99999999, 11111111);
        const pass = "1234";
        const Role = "Customer";

        const response = await axios.post(`${envData.baseUrl}/user/create`,
            {
                name: Name,
                email: Email,
                password: pass,
                phone_number: phone,
                nid: nid,
                role: Role,
            },
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": envData.Token,
                    "X-AUTH-SECRET-KEY": envData.partnerKey,
                },
            }
        ).then((res) => res.data.user);
        console.log(response);


        const name = response.name;
        const phoneNum = response.phone_number;
        const role = response.role;

        const newUserObj =
        {

            name: name,
            phone_number: phoneNum,
            role: role,
        };

        userInfo.push(newUserObj);

        fs.writeFileSync("testdata/user.json", JSON.stringify(userInfo));
        console.log("Saved! Successfully.");
    });

})
