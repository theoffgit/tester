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
    { phone: threadOne.phone, prevent_send_sms: "1" },
    threadOne
  );
  const thePin = threadOne.lastresp.pin;
  threadOne = await theFetch(
    "SignIn",
    { phone: threadOne.phone, pin: thePin },
    threadOne
  );

  // const formData = new FormData();
  // const binary = new Uint8Array([97, 98, 99]);
  // const abc = new File([binary], "380507770108.jpg", { type: "text/plain" });
  // formData.set(
  //   "contacts",
  //   '[{"nickname":"Masha","phone":"+38 (099) 800-12-12"},{"nickname":"Vasya777","phone":"+38 (050) 777-01-08"}]'
  // );
  // formData.set("avatars[]", abc, "+380507770108.jpg");
  // const response = await fetch(`${apiUrl}ContactsSync!`, {
  //   method: "POST",
  //   body: formData,
  //   headers: { Cookie: threadOne.cookie },
  // });
  // const data = await response.json();
  // console.log({ data });
}
