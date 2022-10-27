// https://festa.alef.show/api/engine/apitester.php

import fetch, { FormData, File, fileFrom } from 'node-fetch';


async function theFetch(theMethod, theData, thread){

    const formData = new FormData();

    for(const key in theData){
        await formData.set(key, theData[key]);
    }

    let headers = {};
    if(thread.cookie !== null){
        headers['Cookie'] = thread.cookie;
    }


    const response = await fetch(thread.theUrl+theMethod+'!', { method: 'POST', body: formData, headers: headers });

    const data = await response.json();
    //console.log(data);

    const respHeaders = await response.headers.raw();
    if( typeof (respHeaders['set-cookie']) !== 'undefined' && respHeaders['set-cookie'].length == 2){
        const cuka1 = respHeaders['set-cookie'][0].split(';');
        const cuka2 = respHeaders['set-cookie'][1].split(';');
        thread.cookie = cuka1[0] + '; ' + cuka2[0];
    }

    thread.lastresp = data;
    return thread;

}

//Шаблон "СОЗДАТЬ ЮЗЕРА":
//- SmsPin
//- SignIn


async function case1(){
//Кейс №1 "Проверить разлогинивание"
//Шаги:
//1. СОЗДАТЬ ЮЗЕРА
//2. EditUser - должен быть положительный ответ
//3. SignOut
//4. EditUser - должен быть негативный ответ

    let threadOne = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-64-75", cookie: null};

    threadOne = await theFetch("SmsPin", {phone: threadOne.phone, prevent_send_sms: "1" }, threadOne);
    const thePin = threadOne.lastresp.pin;
    console.log(thePin);
//    console.log(threadOne);
    threadOne = await theFetch("SignIn", { phone: threadOne.phone, pin: thePin }, threadOne);
    console.log(threadOne);
    threadOne = await theFetch("EditUser", { name: "Калоша Оползнева", email: "some@email.ru", birthday: "1998-12-12" }, threadOne);
    console.log(threadOne);
    threadOne = await theFetch("SignOut", {}, threadOne);
    console.log(threadOne);

    threadOne = await theFetch("EditUser", { name: "Клуша Выползнева", email: "someme@email.ru", birthday: "1995-12-12" }, threadOne);
    console.log(threadOne);

}

//case1();


async function case2(){
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

    let threadOne = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-01-04", cookie: null};
    let threadTwo = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-02-04", cookie: null};

    console.log('//1. СОЗДАТЬ ЮЗЕРА (юзер №1)');
    threadOne = await theFetch("SmsPin", {phone: threadOne.phone, prevent_send_sms: "1" }, threadOne);
    const thePin = threadOne.lastresp.pin;
    console.log(thePin);
//    console.log(threadOne);
    threadOne = await theFetch("SignIn", { phone: threadOne.phone, pin: thePin }, threadOne);
    threadOne.user = threadOne.lastresp.user;
    console.log(JSON.stringify(threadOne));

    console.log('//1. СОЗДАТЬ ЮЗЕРА (юзер №2)');
    threadTwo = await theFetch("SmsPin", {phone: threadTwo.phone, prevent_send_sms: "1" }, threadTwo);
    const thePin2 = threadTwo.lastresp.pin;
    console.log(thePin2);
//    console.log(threadOne);
    threadTwo = await theFetch("SignIn", { phone: threadTwo.phone, pin: thePin2 }, threadTwo);
    threadTwo.user = threadTwo.lastresp.user;
    console.log(JSON.stringify(threadTwo));

    console.log('//3. юзер №1: AdHocCreate (с указанием юзера №2)');
    threadOne = await theFetch("AdHocCreate", {title: "First Event Title", persons: "["+threadTwo.user.id+"]", day: "tomorrow" , day_part: "evening"  }, threadOne);
    console.log(JSON.stringify(threadOne.lastresp));
    const firstEventId = threadOne.lastresp.event_id;

    console.log('//4. юзер №1: AdHocGetByID (с ID из шага №3) - должно отобразиться AdHoc-событие');
    threadOne = await theFetch("AdHocGetByID", { event_id: firstEventId }, threadOne);
    console.log(JSON.stringify(threadOne.lastresp));

    console.log('//5. юзер №1: AdHocCreate (с указанием юзера №2)');
    threadOne = await theFetch("AdHocCreate", {title: "Second Event Title", persons: '['+threadTwo.user.id+']', day: "tomorrow" , day_part: "evening"  }, threadOne);
    console.log(JSON.stringify(threadOne.lastresp));
    const secondEventId = threadOne.lastresp.event_id;

    console.log('//6. юзер №1: AdHocUpdate (с ID из шага №5)');
    threadOne = await theFetch("AdHocUpdate", { event_id: secondEventId, title: "Second Event Title Updated", persons: '['+threadTwo.user.id+']', day: "today" , day_part: "morning"  }, threadOne);
    console.log(JSON.stringify(threadOne.lastresp));

    console.log('//7. юзер №2: AdHocsGet - должно быть два AdHoc-события (второе с измененными данными)');
    threadTwo = await theFetch("AdHocsGet", {}, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));

    console.log('//8. юзер №1: AdHocDelete (с ID из шага №3)');
    threadOne = await theFetch("AdHocDelete", { event_id: firstEventId }, threadOne);
    console.log(JSON.stringify(threadOne.lastresp));

    console.log('//9. юзер №1: AdHocsGet - должно быть одно AdHoc-событие');
    threadOne = await theFetch("AdHocsGet", {}, threadOne);
    console.log(JSON.stringify(threadOne.lastresp));

    console.log('//10. юзер №2: InvitesGet - должно быть одно приглашение');
    threadTwo = await theFetch("InvitesGet", {}, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));
    const inviteId = threadTwo.lastresp.invites[0].id;

    console.log('//11. юзер №2: InviteGetByID (с ID из шага №10) - должно отобразиться приглашение');
    threadTwo = await theFetch("InviteGetByID", { invite_id: inviteId }, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));

    console.log('//12. юзер №2: UpcomingEventsGet - должно быть одно событие и поле "participate" == null');
    threadTwo = await theFetch("UpcomingEventsGet", {}, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));
    const upcomingEventId = threadTwo.lastresp.upcoming_events[0].id;

    console.log('//13. юзер №2: InviteParticipate (с ID из шага №10 и "participate" = 1)');
    threadTwo = await theFetch("InviteParticipate", { invite_id: inviteId, participate: "1", event_id: ""}, threadTwo);
    console.log(JSON.stringify(threadTwo));

    console.log('//14. юзер №2: UpcomingEventGetByID (с ID из шага №12) - должно отобразиться события и поле "participate" == 1');
    threadTwo = await theFetch("UpcomingEventGetByID", { upcoming_event_id: upcomingEventId}, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));

    console.log('//15. юзер №2: UpcomingEventDelete (с ID из шага №10)');
    threadTwo = await theFetch("UpcomingEventDelete", { upcoming_event_id: inviteId}, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));

    console.log('//16. юзер №2: UpcomingEventsGet - должен быть пустой список событий');
    threadTwo = await theFetch("UpcomingEventsGet", {}, threadTwo);
    console.log(JSON.stringify(threadTwo.lastresp));

}

case2();