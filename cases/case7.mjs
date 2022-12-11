import { getFakeUsers, theFetch } from "../apitester.mjs";


//Кейс №6 "Проверить Gift
//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. СОЗДАТЬ ЮЗЕРА (юзер №2)
//3. СОЗДАТЬ ЮЗЕРА (юзер №3)
//4. юзер №1: ContactsSync с указанием юзеров №2, №3 в качестве контактов
//5. юзер №1: ContactsGet. юзер №2 должен быть в контактах
//6. юзер №1: CongratulationCreate для юзера №2
//7. юзер №1: CongratulationGetByID c congratulation_id из шага 5
//8. юзер №1: CongratulationsGet в ответе должно быть поздравление из шага 5
//9. юзер №1: CongratulationUpdate c congratulation_id из шага 5
//10. юзер №1: CongratulationGetByID c congratulation_id из шага 5
//11. юзер №1: CongratulationDelete c congratulation_id из шага 5
//12. юзер №1: CongratulationsGet не должно быть поздравлений


export default async function () {
    const [{ phone: phone1 }, { phone: phone2 }, { phone: phone3 }] = getFakeUsers(3);


    let threadOne = { phone: phone1, cookie: null};
    let threadTwo = { phone: phone2, cookie: null};
    let threadThree = { phone: phone3, cookie: null};

    console.log('//1. СОЗДАТЬ ЮЗЕРА (юзер №1)');
    threadOne = await theFetch(
        "SmsPin",
        {
             phone: threadOne.phone,
             prevent_send_sms: "1",
             registration: "1",
        },
        threadOne
    );
    const thePin = threadOne.lastresp.pin;
    threadOne = await theFetch(
        "SignIn",
        {
            phone: threadOne.phone,
            pin: thePin,
        },
        threadOne
    );
    threadOne.user = threadOne.lastresp.user;

    threadOne = await theFetch(
        "EditUser",
        {
            name: "user1",
            birthday: "2003-03-31",
        },
        threadOne
    );


    console.log('//2. СОЗДАТЬ ЮЗЕРА (юзер №2)');
    threadTwo = await theFetch(
        "SmsPin",
        {
            phone: threadTwo.phone,
            prevent_send_sms: "1",
            registration: "1",
        },
        threadTwo
    );
    const thePin2 = threadTwo.lastresp.pin;
    threadTwo = await theFetch(
        "SignIn",
        {
            phone: threadTwo.phone,
            pin: thePin2,
        },
        threadTwo
    );
    threadTwo.user = threadTwo.lastresp.user;

    threadTwo = await theFetch(
        "EditUser",
        {
            name: "user2",
            birthday: "2003-03-31",
        },
        threadTwo
    );


    console.log('//3. СОЗДАТЬ ЮЗЕРА (юзер №3)');
    threadThree = await theFetch(
        "SmsPin",
        {
            phone: threadThree.phone,
            prevent_send_sms: "1",
            registration: "1",
        },
        threadThree
    );
    const thePin3 = threadThree.lastresp.pin;
    threadThree = await theFetch(
        "SignIn",
        {
            phone: threadThree.phone,
            pin: thePin3,
        },
        threadThree
    );
    threadThree.user = threadThree.lastresp.user;

    threadThree = await theFetch(
        "EditUser",
        {
            name: "user3",
            birthday: "2003-03-31",
        },
        threadThree
    );



    console.log('//4. юзер №1: ContactsSync с указанием юзеров №2, №3 в качестве контактов');
    threadOne = await theFetch(
        "ContactsSync",
        {
            contacts: '[{"nickname":"Masha","phone":"'+threadTwo.phone+'"},{"nickname":"Pasha","phone":"'+threadThree.phone+'"}]',
        },
        threadOne,
        (result) => {
            return (
                      result.accepted_contacts.length == 2 &&
                      result.accepted_contacts.some(el => (el.user_id == threadTwo.user.id)) &&
                      result.accepted_contacts.some(el => (el.user_id == threadThree.user.id))
                   );
        }
    );
    console.log('//5. юзер №1: ContactsGet. юзер №2 должен быть в контактах');
    threadOne = await theFetch(
        "ContactsGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.contacts.length == 2 &&
                      result.contacts.some(el => (el.user_id == threadTwo.user.id))
                   );
        }
    );

    console.log('//6. юзер №1: CongratulationCreate для юзера №2');
    threadOne = await theFetch(
        "CongratulationCreate",
        {
            event_user_id: threadTwo.user.id,
            event_time: "28.06.2023 12:00",
            text: "текст поздравления",
            video: "http://localhost/somevideo",
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      result.congratulation_id > 0
                   );
        }
    );
    const congratulationId = threadOne.lastresp.congratulation_id;

    console.log('//7. юзер №1: CongratulationGetByID c congratulation_id из шага 5');
    threadOne = await theFetch(
        "CongratulationGetByID",
        {
            congratulation_id: congratulationId,
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      typeof(result.congratulation) == "object"
                   );
        }
    );

    console.log('//8. юзер №1: CongratulationsGet в ответе должно быть поздравление из шага 5');
    threadOne = await theFetch(
        "CongratulationsGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      result.congratulations.length > 0 &&
                      result.congratulations.some(el => (el.id == congratulationId))
                   );
        }
    );

    console.log('//9. юзер №1: CongratulationUpdate c congratulation_id из шага 5');  //  можно менять все перечисленное...  оно кусками и меняется - включая изменение целевого юзера
    threadOne = await theFetch(                                                       // поэтому в следующем шаге отсутствует проверка
        "CongratulationUpdate",
        {
            congratulation_id: congratulationId,
            event_user_id: threadThree.user.id,
            event_time: "24.02.2024 14:00",
            text: "текст поздравления изменено",
            video: "http://localhost/somevideo/updated",

        },
        threadOne,
        (result) => {
            return (
                      result.status === 0
                   );
        }
    );

    console.log('//10. юзер №1: CongratulationGetByID c congratulation_id из шага 5');
    threadOne = await theFetch(
        "CongratulationGetByID",
        {
            congratulation_id: congratulationId,
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0
                   );
        }
    );

    console.log('//11. юзер №1: CongratulationDelete c congratulation_id из шага 5');
    threadOne = await theFetch(
        "CongratulationDelete",
        {
            congratulation_id: congratulationId,
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0
                   );
        }
    );


    console.log('//12. юзер №1: CongratulationsGet не должно быть поздравлений');
    threadOne = await theFetch(
        "CongratulationsGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      result.congratulations.length == 0
                   );
        }
    );



}
