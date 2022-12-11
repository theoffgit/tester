import fetch, { FormData, File } from "node-fetch";
import { getFakeUsers, theFetch } from "../apitester.mjs";

//Шаблон "СОЗДАТЬ ЮЗЕРА":
//- SmsPin
//- SignIn

export default async function () {
  const [{ phone }] = getFakeUsers();

  let threadOne = { phone, cookie: null };
  threadOne = await theFetch(
    "SmsPin",
    { phone: threadOne.phone, prevent_send_sms: "1", registration: "1" },
    threadOne
  );
  const thePin = threadOne.lastresp.pin;
  threadOne = await theFetch(
    "SignIn",
    { phone: threadOne.phone, pin: thePin},
    threadOne
  );
}
