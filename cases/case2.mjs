import { getFakeUsers, theFetch } from "../apitester.mjs";

//Кейс №2 "Проверить AdHoc"
//Шаги:
//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. СОЗДАТЬ ЮЗЕРА (юзер №2
//3. юзер №1: AdHocCreate (с указанием юзера №2)
//4. юзер №1: AdHocGetByID (с ID из шага №3) - должно отобразиться AdHoc-событие
//5. юзер №1: AdHocCreate (с указанием юзера №2)
//6. юзер №1: AdHocUpdate (с ID из шага №5)
//7. юзер №2: AdHocsGet - должно быть два AdHoc-события (второе с измененными данными)
//8. юзер №1: AdHocDelete (с ID из шага №3)
//9. юзер №1: AdHocsGet - должно быть одно AdHoc-событие
//10. юзер №2: InvitesGet - должно быть одно приглашение
//11. юзер №2: InviteGetByID (с ID из шага №10) - должно отобразиться приглашение
//12. юзер №2: UpcomingEventsGet - должно быть одно событие и поле "participate" == null
//13. юзер №2: InviteParticipate (с ID из шага №10 и "participate" = 1)
//14. юзер №2: UpcomingEventGetByID (с ID из шага №12) - должно отобразиться события и поле "participate" == 1
//15. юзер №2: UpcomingEventDelete (с ID из шага №10)
//16. юзер №2: UpcomingEventsGet - должен быть пустой список событий

export default async function () {
  const [{ phone: phone1 }, { phone: phone2 }] = getFakeUsers(2);

  let threadOne = { phone: phone1, cookie: null };
  let threadTwo = { phone: phone2, cookie: null };

  console.log("//1. СОЗДАТЬ ЮЗЕРА (юзер №1)");
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
  threadOne.user = threadOne.lastresp.user;
  console.log("//2. СОЗДАТЬ ЮЗЕРА (юзер №2)");
  threadTwo = await theFetch(
    "SmsPin",
    { phone: threadTwo.phone, prevent_send_sms: "1" },
    threadTwo
  );
  const thePin2 = threadTwo.lastresp.pin;
  threadTwo = await theFetch(
    "SignUp",
    { phone: threadTwo.phone, pin: thePin2, name: "Фиолетта Судноплатова", birthday: "1987-11-11"},
    threadTwo
  );
  threadTwo.user = threadTwo.lastresp.user;
  console.log("//3. юзер №1: AdHocCreate (с указанием юзера №2)");
  threadOne = await theFetch(
    "AdHocCreate",
    {
      title: "First Event Title",
      persons: "[" + threadTwo.user.id + "]",
      day: "tomorrow",
      day_part: "evening",
    },
    threadOne
  );
  const firstEventId = threadOne.lastresp.event_id;
  console.log(
    "//4. юзер №1: AdHocGetByID (с ID из шага №3) - должно отобразиться AdHoc-событие"
  );
  threadOne = await theFetch(
    "AdHocGetByID",
    { event_id: firstEventId },
    threadOne,
        (result) => {
            return (
                        result.adhoc !==  undefined
                   );
        }

  );
  console.log("//5. юзер №1: AdHocCreate (с указанием юзера №2)");
  threadOne = await theFetch(
    "AdHocCreate",
    {
      title: "Second Event Title",
      persons: "[" + threadTwo.user.id + "]",
      day: "tomorrow",
      day_part: "evening",
    },
    threadOne
  );
  const secondEventId = threadOne.lastresp.event_id;
  console.log("//6. юзер №1: AdHocUpdate (с ID из шага №5)");
  threadOne = await theFetch(
    "AdHocUpdate",
    {
      event_id: secondEventId,
      title: "Second Event Title Updated",
      persons: "[" + threadTwo.user.id + "]",
      day: "tomorrow",
      day_part: "morning",
    },
    threadOne
  );
  console.log(
    "//7. юзер №2: AdHocsGet - должно быть два AdHoc-события (второе с измененными данными)"
  );
  threadTwo = await theFetch("AdHocsGet", {}, threadTwo, (result) => {
            return (
                        result.adhocs.length == 2 &&
                        result.adhocs.some(el => (el.event.title == 'Second Event Title Updated'))
                   );
        }
  );
  console.log("//8. юзер №1: AdHocDelete (с ID из шага №3)");
  threadOne = await theFetch(
    "AdHocDelete",
    { event_id: firstEventId },
    threadOne
  );
  console.log("//9. юзер №1: AdHocsGet - должно быть одно AdHoc-событие");
  threadOne = await theFetch("AdHocsGet", {}, threadOne, (result) => {
            return (
                        result.adhocs.length == 1
                   );
        }
  );
  console.log(
    "//10. юзер №2: InvitesGet - должно быть два приглашения и у удаленного на шаге №8 приглашения должен стоять status === deleted"
  );
  threadTwo = await theFetch("InvitesGet", {}, threadTwo, (result) => {
    return (
      result.invites.length === 2 &&
      result.invites.find((item) => item.event.id === firstEventId)?.event
        .status === "deleted" &&
      result.invites.find((item) => item.event.status === "upcoming") !==
        undefined
    );
  });
  const invite = threadTwo.lastresp.invites.find(
    (item) => item.event.status === "upcoming"
  );
  const inviteId = invite.id;
  const eventId = invite.event.id;
  console.log(
    "//11. юзер №2: InviteGetByID (с ID из шага №10) - должно отобразиться приглашение"
  );
  threadTwo = await theFetch(
    "InviteGetByID",
    { invite_id: inviteId },
    threadTwo,
    (result) => {
            return (
                        result.invite !== undefined
                   );
        }
  );
  console.log(
    "//12. юзер №2: UpcomingEventsGet - должно быть два события и у удаленного на шаге №8 приглашения должен стоять status === deleted, а второго status===upcoming и participate===null"
  );
  threadTwo = await theFetch("UpcomingEventsGet", {}, threadTwo, (result) => {
    return (
      result.upcoming_events.length === 2 &&
      result.upcoming_events.find((item) => item.event.id === firstEventId)
        ?.event.status === "deleted" &&
      result.upcoming_events.find((item) => item.event.status === "upcoming")
        .participate === null
    );
  });
  const upcomingEvent = threadTwo.lastresp.upcoming_events.find(
    (item) => item.event.status === "upcoming"
  );
  console.log(
    '//13. юзер №2: InviteParticipate (с ID из шага №10 и "participate" = 1)'
  );
  threadTwo = await theFetch(
    "InviteParticipate",
    { invite_id: inviteId, participate: "1", event_id: "" },
    threadTwo
  );
  console.log(
    '//14. юзер №2: UpcomingEventGetByID (с ID из шага №12) - должно отобразиться события и поле "participate" == 1'
  );
  threadTwo = await theFetch(
    "UpcomingEventGetByID",
    { upcoming_event_id: upcomingEvent.id },
    threadTwo,
    (result) => {
            return (
                        result.upcoming_event !== undefined &&
                        result.upcoming_event.participate == 1
                   );
        }
  );
  console.log("//15. юзер №2: UpcomingEventDelete (с ID из шага №10)");
  threadTwo = await theFetch(
    "UpcomingEventDelete",
    { upcoming_event_id: upcomingEvent.id },
    threadTwo
  );
  console.log(
    "//16. юзер №2: UpcomingEventsGet - в списке не должно быть событий с status===upcoming"
  );
  threadTwo = await theFetch("UpcomingEventsGet", {}, threadTwo, (result) => {
    return (
      result.upcoming_events.find(
        (item) => item.event.status === "upcoming"
      ) === undefined
    );
  });
}
