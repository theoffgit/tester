import fetch from 'node-fetch';

// Error handle

class HTTPResponseError extends Error {
    constructor(response, ...args) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
        this.response = response;
    }
}
const checkStatus = response => {
    if (response.ok) {
        return response;
    } else {
        throw new HTTPResponseError(response);
    }
}

// End Error Handle

const body = {
  "userData": {
    "phone": "9265126677",
//    "name": "Николай",
//    "timezone": "Europe/Saratov",
//    "config": {
//      "phoneCode": "7"
//    }
  },
  "preventSendSms": true,
  "disableTimeout": true
};

// ROUTES

// /user/auth

const userAuth = async thread =>{
    const body = {
      "userData": {
      "phone": thread.phone,
//    "name": "Николай",
//    "timezone": "Europe/Saratov",
//    "config": {
//       "phoneCode": "7"
//    }
    },
    "preventSendSms": true,
    "disableTimeout": true
    };

    const response = await fetch(thread.theurl+'/user/auth', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        //console.log(response.headers.raw()['set-cookie']);
        const cookie = ((response.headers.raw()['set-cookie'])[0]).split(';')
        return {theurl: thread.theurl, phone: thread.phone, code: data.data.code, cookie: cookie[0]};
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /user/auth

// /user/code

const userCode = async thread =>{
    const body = {
      "code": thread.code
    }
    const response = await fetch(thread.theurl+'/user/code', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        //console.log(response.headers.raw()['set-cookie']);
        const cookie = ((response.headers.raw()['set-cookie'])[0]).split(';')
        return {theurl: thread.theurl, phone: thread.phone, cookie: cookie[0]};
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}

// end /user/code

// /user/session

const userSession = async thread =>{
    const response = await fetch(thread.theurl+'/user/session', {
        method: 'get',
        headers: {'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        thread.userId = data.data.userId;
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}


// end /user/session


// /user/getOne

const userGetOne = async thread =>{
    const response = await fetch(thread.theurl+'/user/getOne?userId='+thread.userId, {
        method: 'get',
        headers: {'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}


// end /user/getOne



// /project/create

const projectCreate = async thread =>{
    const body = {
       "title": "Проект №1",
       "config": {},
       "userList": [
          {
             "userId": thread.userId,
             "role": "owner",
             "userName": "Коля",
             "position": "Разработчик в Wazzup",
             "config": {
                "scheduleFilters": {
                    "[ID проекта]": {
                         "showAllTasks": true,
                         "showTaskContent": true
                     }
                 }
             }
         }
       ]
    }

    const response = await fetch(thread.theurl+'/project/create', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        thread.projectId = data.data.id;
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /project/create


// /project/addUser

const projectAddUser = async (thread, theuserId) =>{
    const body = {
       "projectId": thread.projectId,
       "userId": theuserId,
       "userName": "Коля",
       "position": "Разработчик в Wazzup"
    }

    const response = await fetch(thread.theurl+'/project/addUser', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        return;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /project/addUser


// /project/transfer

const projectTransfer = async (thread, theuserId) =>{
    const body = {
         "projectId": thread.projectId,
         "userId": theuserId
    }

    const response = await fetch(thread.theurl+'/project/transfer', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        return;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /project/transfer

// /project/getOne

const projectGetOne = async (thread, theProjectId) =>{
    const response = await fetch(thread.theurl+'/project/getOne?projectId='+theProjectId, {
        method: 'get',
        headers: {'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        console.log(data);
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}

// end /project/getOne


// end ROUTES

let threadOne = { theurl: "http://localhost:3000", phone: "9265126677"};
let threadTwo = { theurl: "http://localhost:3000", phone: "9265126672"};
threadOne = await userAuth(threadOne);
console.log(threadOne);
threadOne = await userCode(threadOne);
console.log(threadOne);
threadOne = await userSession(threadOne);
console.log(threadOne);
threadOne = await projectCreate(threadOne);
console.log(threadOne);

threadTwo = await userAuth(threadTwo);
console.log(threadTwo);
threadTwo = await userCode(threadTwo);
console.log(threadTwo);
threadTwo = await userSession(threadTwo);
console.log(threadTwo);

await projectAddUser(threadOne, threadTwo.userId);
await userGetOne(threadTwo);
await projectTransfer(threadOne, threadTwo.userId);
await projectGetOne(threadTwo, threadOne.projectId);
