import { getFakeUsers, theFetch } from "../apitester.mjs";

//Кейс №3 "Проверить PersonChat"
//Шаги:
//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. СОЗДАТЬ ЮЗЕРА (юзер №2)
//3. СОЗДАТЬ ЮЗЕРА (юзер №3)
//4. юзер №1: PersonChatCreate (с указанием юзера №2)
//5. юзер №1: PersonChatCreate (с указанием юзера №3)
//6. юзер №1: PersonChatsGet - должно быть два чата
//7. юзер №1: PersonChatDelete (с указанием чата с юзером №3 = ID из шага №6)
//8. юзер №1: PersonChatsGet - должен остаться один чат
//9. юзер №1: ChatMessageCreate (с указанием чата с юзером №2 = ID из шага №6 + с обязательным заполнением media_link)
//10. юзер №1: ChatMessageCreate (с указанием чата с юзером №2 = ID из шага №6 + с обязательным заполнением media_link)
//11. юзер №1: ChatMessageUpdate (с указанием ID из шага №9 + с указанием media_link = 0)
//12. юзер №2: PersonChatMessagesGet (с указанием чата с юзером №2 = ID из шага №6 + shift = 0 + count = 10) - должен отобразиться чат с двумя сообщениями, причем в первом media_link === NULL
//13. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №9)
//14. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №10)
//15. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №14)
//16. юзер №2: ChatMessageUpdate (с указанием ID из шага №15 + с указанием reply_id = ID сообщения из шага №13)
//17. юзер №2: PersonChatMessagesGet (с указанием чата с юзером №2 = ID из шага №6 + shift = 2 + count = 1) - должно быть одно сообщение в messages
//17*. юзер №2: PersonChatMessagesGet (повторить шаг 17 с увеличением shift += 1) - должно быть еще две итерации с одним сообщением в messages, а на третьей - пустой массив messages
//18. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 5 и в last_message сообщение из шага №15, у которого reply_id === ID сообщения из шага №13)
//19. юзер №2: ChatMessageDelete (с указанием сообщения из шага №13)
//20. юзер №2: ChatMessageRead (с указанием сообщения из шага №14)
//21. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 3 и в last_message сообщение из шага №15, у которого reply_id === NULL)
//22. юзер №2: ChatMessageDelete (с указанием сообщения из шага №15)
//23. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 2 и в last_message сообщение из шага №14, у которого is_read === 1)

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
    console.log('//4. юзер №1: PersonChatCreate (с указанием юзера №2)');
    threadOne = await theFetch(
        "PersonChatCreate",
        {
            user_id: threadTwo.user.id,
        },
        threadOne
    );
    const chatId = threadOne.lastresp.id;
    console.log('//5. юзер №1: PersonChatCreate (с указанием юзера №3)');
    threadOne = await theFetch(
        "PersonChatCreate",
        {
            user_id: threadThree.user.id,
        },
        threadOne
    );
    const chatId2 = threadOne.lastresp.id;
    console.log('//6. юзер №1: PersonChatsGet - должно быть два чата');
    threadOne = await theFetch(
        "PersonChatsGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.chats.length == 2 &&
                      result.chats.some(el => (el.chat.id == chatId)) &&
                      result.chats.some(el => (el.chat.id == chatId2))
                   );
        }
    );
    console.log('//7. юзер №1: PersonChatDelete (с указанием чата с юзером №3 = ID из шага №6)');   // из шага 5?!
    threadOne = await theFetch(
        "PersonChatDelete",
        {
            id: chatId2,
        },
        threadOne
    );
    console.log('//8. юзер №1: PersonChatsGet - должен остаться один чат');      //  если чатов изначально было 18 - хреновое условие - проверяем наличие целевого чата...
    threadOne = await theFetch(
        "PersonChatsGet",
        {},
        threadOne,
        (result) => {
            return (
                       !result.chats.some(el => (el.chat.id == chatId2))
                   );
        }
    );



    console.log('//9. юзер №1: ChatMessageCreate (с указанием чата с юзером №2 = ID из шага №6 + с обязательным заполнением media_link)');   // из шага 4?!
    threadOne = await theFetch(
        "ChatMessageCreate",
        {
            chat_id: chatId ,
            text: 'некий текст сообщения',
            media_link: 'media_folder/abcdef.mp4',
        },
        threadOne
    );
    const messId = threadOne.lastresp.id;
    console.log('//10. юзер №1: ChatMessageCreate (с указанием чата с юзером №2 = ID из шага №6 + с обязательным заполнением media_link)');
    threadOne = await theFetch(
        "ChatMessageCreate",
        {
            chat_id: chatId ,
            text: 'некий текст сообщения',
            media_link: 'media_folder/abcdef.mp4',
        },
        threadOne
    );
    const messId2 = threadOne.lastresp.id;
    console.log('//11. юзер №1: ChatMessageUpdate (с указанием ID из шага №9 + с указанием media_link = 0)');
    threadOne = await theFetch(
        "ChatMessageUpdate",
        {
            id: messId,
            text: 'некий текст сообщения -измененный',
            media_link: 0,
        },
        threadOne
    );
    console.log('//12. юзер №2: PersonChatMessagesGet (с указанием чата с юзером №2 = ID из шага №6 + shift = 0 + count = 10) - должен отобразиться чат с двумя сообщениями, причем в первом media_link === NULL');
    threadOne = await theFetch(
        "PersonChatMessagesGet",
        {
            id: chatId,
            shift:0,
            count:10,
        },
        threadOne,
        (result) => {
            return (
                        result.messages.length == 2 &&
                        result.messages.some(el => (el.id == messId && el.media_link === null)) &&
                        result.messages.some(el => (el.id == messId2))
                   );
        }
    );
    console.log('//13. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №9)');  // из шага 4?!
    threadTwo = await theFetch(
        "ChatMessageCreate",
        {
            chat_id: chatId,
            reply_id: messId ,
            text: 'некий текст сообщения шаг 13',
            media_link: 'media_folder/abcdef.mp4',
        },
        threadTwo
    );
    const messId3 = threadTwo.lastresp.id;
    console.log('//14. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №10)');
    threadTwo = await theFetch(
        "ChatMessageCreate",
        {
            chat_id: chatId,
            reply_id: messId2,
            text: 'некий текст сообщения шаг 14',
            media_link: 'media_folder/abcdef.mp4',
        },
        threadTwo
    );
    const messId4 = threadTwo.lastresp.id;
    console.log('//15. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №14)'); // самому себе ответ?!
    threadTwo = await theFetch(
        "ChatMessageCreate",
        {
            chat_id: chatId,
            reply_id: messId4,
            text: 'некий текст сообщения шаг 15',
            media_link: 'media_folder/abcdef.mp4',
        },
        threadTwo
    );
    const messId5 = threadTwo.lastresp.id;
//    console.log("here from step 15: " + messId5);
    console.log('//16. юзер №2: ChatMessageUpdate (с указанием ID из шага №15 + с указанием reply_id = ID сообщения из шага №13)');
    threadTwo = await theFetch(
        "ChatMessageUpdate",
         {
             id: messId5,
             text: 'некий текст сообщения -измененный в шаге 16',
             media_link: '0',
             reply_id: messId3,
         },
         threadTwo
    );
    console.log('//17. юзер №2: PersonChatMessagesGet (с указанием чата с юзером №2 = ID из шага №6 + shift = 2 + count = 1) - должно быть одно сообщение в messages');
    threadTwo = await theFetch(
        "PersonChatMessagesGet",
        {
            id: chatId,
            shift:2,
            count:1,
        },
        threadTwo,
        (result) => {
            return (
                        result.messages.length == 1
                   );
        }
    );
    console.log('//17*. юзер №2: PersonChatMessagesGet (повторить шаг 17 с увеличением shift += 1) - должно быть еще две итерации с одним сообщением в messages, а на третьей - пустой массив messages');
    threadTwo = await theFetch(
        "PersonChatMessagesGet",
        {
            id: chatId,
            shift:3,
            count:1,
        },
        threadTwo,
        (result) => {
            return (
                        result.messages.length == 1
                   );
        }
    );
    threadTwo = await theFetch(
        "PersonChatMessagesGet",
        {
            id: chatId,
            shift:4,
            count:1,
        },
        threadTwo,
        (result) => {
            return (
                        result.messages.length == 1
                   );
        }
    );
    threadTwo = await theFetch(
        "PersonChatMessagesGet",
        {
            id: chatId,
            shift:5,
            count:1,
        },
        threadTwo,
        (result) => {
            return (
                        result.messages.length == 0
                   );
        }
    );
    console.log('//18. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 5 и в last_message сообщение из шага №15, у которого reply_id === ID сообщения из шага №13)');
    threadOne = await theFetch(
        "PersonChatsGet",
        {},
        threadOne,
        (result) => {
            return (
                       result.chats.length == 1 &&
                       result.chats.unread_messages == 5 &&
                       result.chats.last_message.id == messId5 &&
                       result.chats.last_message.reply_id == messId3
                   );
        }
    );
    console.log('//19. юзер №2: ChatMessageDelete (с указанием сообщения из шага №13)');
    threadTwo = await theFetch(
        "ChatMessageDelete",
        {
            id: messId3,
        },
        threadTwo
    );
    console.log('//20. юзер №2: ChatMessageRead (с указанием сообщения из шага №14)');
    threadTwo = await theFetch(
        "ChatMessageRead",
        {
            id: messId4,
        },
        threadTwo
    );
    console.log('//21. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 3 и в last_message сообщение из шага №15, у которого reply_id === NULL)');
    threadOne = await theFetch(
        "PersonChatsGet",
        {},
        threadOne,
        (result) => {
            return (
                       result.chats.length == 1 &&
                       result.chats.last_message.id == messId5 &&
                       result.chats.last_message.reply_id === null
                   );
        }
    );
    console.log('//22. юзер №2: ChatMessageDelete (с указанием сообщения из шага №15)');
    threadTwo = await theFetch(
        "ChatMessageDelete",
        {
            id: messId5,
        },
        threadTwo
    );
    console.log('//23. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 2 и в last_message сообщение из шага №14, у которого is_read === 1)');
    threadOne = await theFetch(
        "PersonChatsGet",
        {},
        threadOne,
        (result) => {
            return (
                        result.chats.length ==  1 &&
                        result.chats.last_message.id == messId4 &&
                        result.chats.last_message.is_read == 1
                   );
        }
    );
}
