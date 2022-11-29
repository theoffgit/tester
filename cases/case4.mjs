import { getFakeUsers, theFetch } from "../apitester.mjs";

//Кейс №4 "Проверить GroupChat"

//Шаги:

//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. СОЗДАТЬ ЮЗЕРА (юзер №2)
//3. СОЗДАТЬ ЮЗЕРА (юзер №3)
//4. юзер №1: GroupChatCreate (с указанием юзеров [1,2])
//5. юзер №1: GroupChatUpdate (с указанием юзеров [1,2,3])
//6. юзер №2: GroupChatCreate (с указанием юзеров [1,2,3])
//7. юзер №3: GroupChatsGet - должно быть 3 чата
//8. юзер №1: GroupChatDelete (с указанием ID из шага №5)
//9. юзер №2: GroupChatsGet - должно быть 2 чата
//* тут дальше желательно добавить те-же самые шаги, что и в Кейсе №3 (начиная с 9 шага), но я их специально не расписываю, чтобы ты мог сам оценить, 
//есть ли там возможность создать конструкцию, которая их продублирует (и позволит в дальнейшем дублировать части шагов из одного этапа в другом)

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
        },
        threadOne
    );
    const thePin = threadOne.lastresp.pin;
    threadOne = await theFetch(
        "SignUp",
        {
            phone: threadOne.phone,
            pin: thePin,
            name: "Фиолетта Судноплатова",
            birthday: "1987-11-11",
        },
        threadOne
    );
    threadOne.user = threadOne.lastresp.user;
    console.log('//2. СОЗДАТЬ ЮЗЕРА (юзер №2)');
    threadTwo = await theFetch(
        "SmsPin",
        {
            phone: threadTwo.phone,
            prevent_send_sms: "1",
        },
        threadTwo
    );
    const thePin2 = threadTwo.lastresp.pin;
    threadTwo = await theFetch(
        "SignUp",
        {
            phone: threadTwo.phone,
            pin: thePin2,
            name: "Фиолетта Судноплатова",
            birthday: "1987-11-11",
        },
        threadTwo
    );
    threadTwo.user = threadTwo.lastresp.user;
    console.log('//3. СОЗДАТЬ ЮЗЕРА (юзер №3)');
    threadThree = await theFetch(
        "SmsPin",
         {
             phone: threadThree.phone,
             prevent_send_sms: "1",
         },
         threadThree
    );
    const thePin3 = threadThree.lastresp.pin;
    threadThree = await theFetch(
        "SignUp",
        {
            phone: threadThree.phone,
            pin: thePin3,
            name: "Фиолетта Судноплатова",
            birthday: "1987-11-11",
        },
        threadThree
    );
    threadThree.user = threadThree.lastresp.user;
    console.log('//4. юзер №1: GroupChatCreate (с указанием юзеров [1,2])');
    threadOne = await theFetch(
        "GroupChatCreate",
        {
            user_ids: '['+threadOne.user.id+','+threadTwo.user.id+']',
            title: "Титл для чата из пункта 4...",
        },
        threadOne
    );
    const chatId = threadOne.lastresp.id;
    console.log('//5. юзер №1: GroupChatUpdate (с указанием юзеров [1,2,3])');
    threadOne = await theFetch(
        "GroupChatUpdate",
        {
            id: chatId,
            user_ids: '['+threadOne.user.id+','+threadTwo.user.id+','+threadThree.user.id+']',
            title: "Титл для чата из пункта 4... Измененный!",
        },
        threadOne
    );
    console.log('//6. юзер №2: GroupChatCreate (с указанием юзеров [1,2,3])');
    threadTwo = await theFetch(
        "GroupChatCreate",
         {
             user_ids: '['+threadOne.user.id+','+threadTwo.user.id+','+threadThree.user.id+']',
             title: "Титл для чата из пункта 6...",
         },
         threadTwo
    );
    const chatId2 = threadTwo.lastresp.id;
    console.log('//7. юзер №3: GroupChatsGet - должно быть 2 чата');
    threadThree = await theFetch(
        "GroupChatsGet",
        {},
        threadThree,
        (result) => {
            return (
                        result.chats.length == 2 &&
                        result.chats.some(el => (el.chat.id == chatId)) &&
                        result.chats.some(el => (el.chat.id == chatId2))
                   );
        }
    );
    console.log('//8. юзер №1: GroupChatDelete (с указанием ID из шага №6)');
    threadTwo = await theFetch(
        "GroupChatDelete",
        {
            id: chatId2
        },
        threadTwo
    );
    console.log('////9. юзер №2: GroupChatsGet  - должен остаться один чат');
    threadTwo = await theFetch(
        "GroupChatsGet",
         {},
         threadTwo,
        (result) => {
            return (
                       result.chats.length == 1 &&
                       !result.chats.some(el => (el.chat.id == chatId2))
                   );
        }
    );

//* тут дальше желательно добавить те-же самые шаги, что и в Кейсе №3 (начиная с 9 шага), но я их специально не расписываю, чтобы ты мог сам оценить,.
//есть ли там возможность создать конструкцию, которая их продублирует (и позволит в дальнейшем дублировать части шагов из одного этапа в другом)

}
