import { getFakeUsers, theFetch } from "../apitester.mjs";

//Кейс №1 "Проверить разлогинивание"
//Шаги:
//1. СОЗДАТЬ ЮЗЕРА
//2. EditUser - должен быть положительный ответ
//3. SignOut
//4. EditUser - должен быть негативный ответ

export default async function () {
  const [{ phone, email }] = getFakeUsers();

  let threadOne = { phone, email, cookie: null };
  threadOne = await theFetch(
    "SmsPin",
    { phone: threadOne.phone, prevent_send_sms: "1" },
    threadOne
  );
  const thePin = threadOne.lastresp.pin;
  threadOne = await theFetch(
    "SignUp",
    { phone: threadOne.phone, pin: thePin, name: "Фиолетта Судноплатова", birthday: "1987-11-11"},
    threadOne
  );
  threadOne = await theFetch(
    "EditUser",
    {
      name: "Калоша Оползнева",
      email: threadOne.email,
      birthday: "1998-12-12",
    },
    threadOne
  );
  threadOne = await theFetch("SignOut", {}, threadOne);
  threadOne = await theFetch(
    "EditUser",
    {
      name: "Клуша Выползнева",
      email: "___" + threadOne.email,
      birthday: "1995-12-12",
    },
    threadOne,
    403
  );
}
