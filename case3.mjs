// https://festa.alef.show/api/engine/apitester.php

import fetch, { FormData, File, fileFrom } from 'node-fetch';
import chalk from 'chalk';
var theLastResp;

async function echo(method, status){
    //console.log('echo');
    //console.log(method);
    //console.log(status);
    switch(status){
        case false:
            console.log(chalk.black.bgRed.bold('FAIL ') + method);
            console.log(JSON.stringify(theLastResp));
            process.exit();
            return;
        case true:
            console.log(chalk.white.bgGrey.bold('PASS ') + method);
            return;
        default:
            console.log(chalk.black.bgRed.bold('LAZHA!!!'));
            return;
    }
}


async function check(method, resp){  // методы со стандартным ответом и стандартным ожидаемым выводом
    //console.log('check');
    //console.log(method);
    //console.log(resp);
    if( typeof(resp.status) === 'undefyned' || resp.status){
        await echo(method, false);
        return;
    }

    let status;

    switch(method){
        case 'SmsPin':
            status = /^\d{4}$/.test(resp.pin);
            break;
        case 'SignIn':
            status = /^\d+$/.test(resp.user.id);
            break;
       default:
            status = true;
            break;
    }
    await echo(method, status);
    return;
}

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
//    console.log(data);
    theLastResp = data;
    await check(theMethod, data);

    const respHeaders = await response.headers.raw();
    if( typeof (respHeaders['set-cookie']) !== 'undefined' && respHeaders['set-cookie'].length == 2){
        const cuka1 = respHeaders['set-cookie'][0].split(';');
        const cuka2 = respHeaders['set-cookie'][1].split(';');
        thread.cookie = cuka1[0] + '; ' + cuka2[0];
    }

    thread.lastresp = data;
    return thread;

}

////////////////////////////////////////////////////////////////////////////////////

async function case3(){

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


    let threadOne = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-06-61", cookie: null};
    let threadTwo = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-06-62", cookie: null};
    let threadThree = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-06-63", cookie: null};

    console.log('//1. СОЗДАТЬ ЮЗЕРА (юзер №1)');
    threadOne = await theFetch("SmsPin", {phone: threadOne.phone, prevent_send_sms: "1" }, threadOne);
    const thePin = threadOne.lastresp.pin;
    threadOne = await theFetch("SignIn", { phone: threadOne.phone, pin: thePin }, threadOne);
    threadOne.user = threadOne.lastresp.user;

    console.log('//2. СОЗДАТЬ ЮЗЕРА (юзер №2)');
    threadTwo = await theFetch("SmsPin", {phone: threadTwo.phone, prevent_send_sms: "1" }, threadTwo);
    const thePin2 = threadTwo.lastresp.pin;
    threadTwo = await theFetch("SignIn", { phone: threadTwo.phone, pin: thePin2 }, threadTwo);
    threadTwo.user = threadTwo.lastresp.user;

    console.log('//3. СОЗДАТЬ ЮЗЕРА (юзер №3)');
    threadThree = await theFetch("SmsPin", {phone: threadThree.phone, prevent_send_sms: "1" }, threadThree);
    const thePin3 = threadThree.lastresp.pin;
    threadThree = await theFetch("SignIn", { phone: threadThree.phone, pin: thePin3 }, threadThree);
    threadThree.user = threadThree.lastresp.user;

    console.log('//4. юзер №1: PersonChatCreate (с указанием юзера №2)');
    threadOne = await theFetch("PersonChatCreate", {user_id: threadTwo.user.id }, threadOne);
    const chatId = threadOne.lastresp.id;
    console.log(chatId);

    console.log('//5. юзер №1: PersonChatCreate (с указанием юзера №3)');
    threadOne = await theFetch("PersonChatCreate", {user_id: threadThree.user.id }, threadOne);
    const chatId2 = threadOne.lastresp.id;
    console.log(chatId2);

    console.log('//6. юзер №1: PersonChatsGet - должно быть два чата');
    threadOne = await theFetch("PersonChatsGet", {}, threadOne);
    if(threadOne.lastresp.chats.length < 2 || !threadOne.lastresp.chats.some(el => (el.chat.id == chatId)) || !threadOne.lastresp.chats.some(el => (el.chat.id == chatId2)) ){
        echo("PersonChatsGet чатов меньше двух или отсутствуют целевые чаты", false);
    }

    console.log('//7. юзер №1: PersonChatDelete (с указанием чата с юзером №3 = ID из шага №6)');   // из шага 5?!
    threadOne = await theFetch("PersonChatDelete", { id: chatId2}, threadOne);

    console.log('//8. юзер №1: PersonChatsGet - должен остаться один чат');      //  если чатов изначально было 18 - хреновое условие - проверяем наличие целевого чата...
    threadOne = await theFetch("PersonChatsGet", {}, threadOne);
    if(threadOne.lastresp.chats.some(el => (el.chat.id == chatId2)) ){
        echo("PersonChatsGet целевой чат не убит... шаг 7 с PersonChatDelete не отработал", false);
    }

    console.log('//9. юзер №1: ChatMessageCreate (с указанием чата с юзером №2 = ID из шага №6 + с обязательным заполнением media_link)');   // из шага 4?!
    threadOne = await theFetch("ChatMessageCreate", {chat_id: chatId , text: 'некий текст сообщения', media_link: 'media_folder/abcdef.mp4'}, threadOne);
    const messId = threadOne.lastresp.id;

    console.log('//10. юзер №1: ChatMessageCreate (с указанием чата с юзером №2 = ID из шага №6 + с обязательным заполнением media_link)');
    threadOne = await theFetch("ChatMessageCreate", {chat_id: chatId , text: 'некий текст сообщения', media_link: 'media_folder/abcdef.mp4'}, threadOne);
    const messId2 = threadOne.lastresp.id;

    console.log('//11. юзер №1: ChatMessageUpdate (с указанием ID из шага №9 + с указанием media_link = 0)');
    threadOne = await theFetch("ChatMessageUpdate", {id: messId, text: 'некий текст сообщения -измененный' , media_link: 0}, threadOne);

    console.log('//12. юзер №2: PersonChatMessagesGet (с указанием чата с юзером №2 = ID из шага №6 + shift = 0 + count = 10) - должен отобразиться чат с двумя сообщениями, причем в первом media_link === NULL');
    threadOne = await theFetch("PersonChatMessagesGet", {id: chatId, shift:0, count:10}, threadOne);
    // если сообщений больше двух - лучше проверять id
    if(threadOne.lastresp.messages.length < 2 || !threadOne.lastresp.messages.some(el => (el.id == messId)) || !threadOne.lastresp.messages.some(el => (el.id == messId2)) ){
        echo("PersonChatMessagesGet месседжей в целевом чате меньше двух или они отсутствуют", false);
    }

    console.log('//13. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №9)');  // из шага 4?!
    threadTwo = await theFetch("ChatMessageCreate", {chat_id: chatId, reply_id: messId , text: 'некий текст сообщения шаг 13', media_link: 'media_folder/abcdef.mp4'}, threadTwo);
    const messId3 = threadTwo.lastresp.id;

    console.log('//14. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №10)');
    threadTwo = await theFetch("ChatMessageCreate", {chat_id: chatId, reply_id: messId2 , text: 'некий текст сообщения шаг 14', media_link: 'media_folder/abcdef.mp4'}, threadTwo);
    const messId4 = threadTwo.lastresp.id;

    console.log('//15. юзер №2: ChatMessageCreate (с указанием с указанием чата с юзером №2 = ID из шага №6 + reply_id = ID сообщения из шага №14)'); // самому себе ответ?!
    threadTwo = await theFetch("ChatMessageCreate", {chat_id: chatId, reply_id: messId4 , text: 'некий текст сообщения шаг 15', media_link: 'media_folder/abcdef.mp4'}, threadTwo);
    const messId5 = threadTwo.lastresp.id;

    console.log('//16. юзер №2: ChatMessageUpdate (с указанием ID из шага №15 + с указанием reply_id = ID сообщения из шага №13)');
    threadTwo = await theFetch("ChatMessageUpdate", {id: messId5, text: 'некий текст сообщения -измененный в шаге 16' , media_link: '0', reply_id: messId3}, threadTwo);

    console.log('//17. юзер №2: PersonChatMessagesGet (с указанием чата с юзером №2 = ID из шага №6 + shift = 2 + count = 1) - должно быть одно сообщение в messages');
    threadTwo = await theFetch("PersonChatMessagesGet", {id: chatId, shift:2, count:1}, threadTwo);
    if(threadTwo.lastresp.messages.length != 1){
        echo("PersonChatMessagesGet шаг 17 ошибка 1", false);
    }

    console.log('//17*. юзер №2: PersonChatMessagesGet (повторить шаг 17 с увеличением shift += 1) - должно быть еще две итерации с одним сообщением в messages, а на третьей - пустой массив messages');
    threadTwo = await theFetch("PersonChatMessagesGet", {id: chatId, shift:3, count:1}, threadTwo);
    if(threadTwo.lastresp.messages.length != 1){
        echo("PersonChatMessagesGet шаг 17 ошибка 2", false);
    }
    threadTwo = await theFetch("PersonChatMessagesGet", {id: chatId, shift:4, count:1}, threadTwo);
    if(threadTwo.lastresp.messages.length != 1){
        echo("PersonChatMessagesGet шаг 17 ошибка 3", false);
    }

    threadTwo = await theFetch("PersonChatMessagesGet", {id: chatId, shift:5, count:1}, threadTwo);
    if(threadTwo.lastresp.messages.length != 0){
        echo("PersonChatMessagesGet шаг 17 ошибка 4", false);
    }


    console.log('//18. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 5 и в last_message сообщение из шага №15, у которого reply_id === ID сообщения из шага №13)');
    //  параметров нет у метода - как я понял - должен быть чат с целевым айди и в нем  unread_messages == 5
    threadOne = await theFetch("PersonChatsGet", {}, threadOne);
    if(threadOne.lastresp.chats.some(el => (el.id == chatId && el.unread_messages == 5)) ){
        echo("PersonChatsGet чет не так... шаг 18", false);
    }

    console.log('//19. юзер №2: ChatMessageDelete (с указанием сообщения из шага №13)');
    threadTwo = await theFetch("ChatMessageDelete", {id: messId3}, threadTwo);

    console.log('//20. юзер №2: ChatMessageRead (с указанием сообщения из шага №14)');
    threadTwo = await theFetch("ChatMessageRead", {id: messId4}, threadTwo);

    console.log('//21. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 3 и в last_message сообщение из шага №15, у которого reply_id === NULL)');
    threadOne = await theFetch("PersonChatsGet", {}, threadOne);
    if(threadOne.lastresp.chats.last_message.id != messId5){
        echo("PersonChatsGet last_message.id не соответствует ожиданиям... шаг 21", false);
    }
    if(threadOne.lastresp.chats.last_message.reply_id !== null){
        echo("PersonChatsGet last_message.reply_id !== null... шаг 21", false);
    }
    if(threadOne.lastresp.chats.length !=  1 || threadOne.lastresp.chats.some(el => (el.id == chatId && el.unread_messages == 3)) ){
        echo("PersonChatsGet чет не так... шаг 21", false);
    }

    console.log('//22. юзер №2: ChatMessageDelete (с указанием сообщения из шага №15)');
    threadTwo = await theFetch("ChatMessageDelete", {id: messId5}, threadTwo);

    console.log('//23. юзер №1: PersonChatsGet (с указанием с указанием чата с юзером №2 = ID из шага №6) - должен быть список с одним чатом, где unread_messages === 2 и в last_message сообщение из шага №14, у которого is_read === 1)');
    threadOne = await theFetch("PersonChatsGet", {}, threadOne);
    if(threadOne.lastresp.chats.last_message.id != messId4){
        echo("PersonChatsGet last_message.id не соответствует ожиданиям... шаг 23", false);
    }

    if(threadOne.lastresp.chats.last_message.is_read != 1){
        echo("PersonChatsGet last_message.is_read != 1... шаг 23", false);
    }

    if(threadOne.lastresp.chats.length !=  1 || threadOne.lastresp.chats.some(el => (el.id == chatId && el.unread_messages == 2)) ){
        echo("PersonChatsGet чет не так... шаг 23", false);
    }


}

case3();