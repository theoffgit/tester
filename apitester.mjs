// https://festa.alef.show/api/engine/apitester.php

import fetch, { FormData, File, fileFrom } from 'node-fetch';


async function theFetch(theMethod, theData, thread){

    const formData = new FormData();

    for(let key in theData){
        await console.log(key + ' => ' + theData[key]);
        await formData.set(key, theData[key]);
    }

    let headers = {};
    if(thread.cookie !== null){
        headers['Cookie'] = thread.cookie;
    }

    const response = await fetch(thread.theUrl+theMethod+'!', { method: 'POST', body: formData, headers: headers });
    const data = await response.json();
    console.log(data);

    const respHeaders = await response.headers.raw();
    if( typeof (respHeaders['set-cookie']) !== 'undefined' && respHeaders['set-cookie'].length == 2){
        const cuka1 = respHeaders['set-cookie'][0].split(';');
        const cuka2 = respHeaders['set-cookie'][1].split(';');
        thread.cookie = cuka1[0] + '; ' + cuka2[0];
    }

    thread.lastresp = data;
    return thread;

}

let threadOne = { theUrl: "https://festa.alef.show/api/index.php?alef_action=", phone: "+38 (050) 770-53-53", cookie: null};

threadOne = await theFetch("SmsPin", {phone: threadOne.phone, prevent_send_sms: "1" }, threadOne);
const thePin = threadOne.lastresp.pin;
console.log(thePin);
console.log(threadOne);

threadOne = await theFetch("SignIn", { phone: threadOne.phone, pin: thePin }, threadOne);
console.log(threadOne);

threadOne = await theFetch("ContactsGroupsGet", {}, threadOne);
console.log(threadOne);

//console.log(response.headers.raw()['set-cookie']);