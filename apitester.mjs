import fetch, { FormData } from "node-fetch";
import case0 from "./cases/case0.mjs";
import case1 from "./cases/case1.mjs";
import case2 from "./cases/case2.mjs";
import case3 from "./cases/case3.mjs";
import case4 from "./cases/case4.mjs";
import case5 from "./cases/case5.mjs";
import case6 from "./cases/case6.mjs";
import case7 from "./cases/case7.mjs";
import case8 from "./cases/case8.mjs";

let API_URL = "https://festa.alef.show/api/index.php?alef_action=";
API_URL = "http://localhost/festaa/api/index.php?alef_action=";

export async function theFetch(theMethod, theData, thread, check = 0) {
  const formData = new FormData();
  for (const key in theData) await formData.set(key, theData[key]);
  let headers = {};
  if (thread.cookie !== null) headers["Cookie"] = thread.cookie;

  const url = API_URL + theMethod + "!";
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers,
  });

  let body, data;
  try {
    body = await response.text();
    data = JSON.parse(body);
  } catch (err) {
    console.log({ err, data, body, url, theData });
    throw err;
  }

  const respHeaders = await response.headers.raw();
  if (
    typeof respHeaders["set-cookie"] !== "undefined" &&
    respHeaders["set-cookie"].length == 2
  ) {
    const cuka1 = respHeaders["set-cookie"][0].split(";");
    const cuka2 = respHeaders["set-cookie"][1].split(";");
    thread.cookie = cuka1[0] + "; " + cuka2[0];
  }

  thread.lastresp = data;
  const resultMsg = theMethod + "::" + JSON.stringify(data);
  if (typeof check === "function") {
    if (!check(data)) throw new Error(resultMsg);
  } else {
    if (data.status !== check) throw new Error(resultMsg);
  }
  console.log(resultMsg);
  return thread;
}

export function getFakeUsers(count = 1) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const num = Math.floor(i + Date.now() / 1000);
    arr.push({
      phone: "+" + num.toString(),
      email: num.toString() + "@mail.ru",
    });
  }
  return arr;
}

const list = [
//  async () => {
//    console.log("CASE №0 STARTING");
//    await case0();
//    console.log("CASE №0 READY");
//  },
//  async () => {
//    console.log("CASE №1 STARTING");
//    await case1();
//    console.log(`CASE №1 READY`);
//  },
//  async () => {
//    console.log("CASE №2 STARTING");
//    await case2();
//    console.log(`CASE №2 READY`);
//  },
// async () => {
//   console.log("CASE №3 STARTING");
//   await case3();
//   console.log("CASE №3 READY");
// },
//   async () => {
//     console.log("CASE №4 STARTING");
//     await case4();
//     console.log("CASE №4 READY");
//   },
//   async () => {
//     console.log("CASE №5 STARTING");
//     await case5();
//     console.log("CASE №5 READY");
//   },
//   async () => {
//     console.log("CASE №6 STARTING");
//     await case6();
//     console.log("CASE №6 READY");
//   },
//  async () => {
//    console.log("CASE №7 STARTING");
//    await case7();
//    console.log("CASE №7 READY");
//  },
  async () => {
    console.log("CASE №8 STARTING");
    await case8();
    console.log("CASE №8 READY");
  },
];

for (const f of list)
  await f().catch((err) => {
    console.log("ERROR:", err);
    process.exit();
  });
