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
        const cookie = ((response.headers.raw()['set-cookie'])[0]).split(';');
        thread.cookie = cookie[0];
        thread.code = data.data.code;
        thread.lastresp = data.data;
        return thread;
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
        const cookie = ((response.headers.raw()['set-cookie'])[0]).split(';');
        thread.cookie = cookie[0];
        thread.lastresp = data.data;
        return thread;
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
        thread.userId = data.data.userId;
        thread.lastresp = data.data;
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
        thread.lastresp = data.data;
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
        thread.lastresp = data.data;
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /project/create


// /project/addUser

const projectAddUser = async (thread, theprojectId, theuserId) =>{
    const body = {
       "projectId": theprojectId,
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
        thread.lastresp = data.data;
        return thread;
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
        thread.lastresp = data.data;
        return thread;
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
        thread.lastresp = data.data;
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}

// end /project/getOne


// /project/getExecutorsTasks

const projectGetExecutorsTasks = async (thread) =>{
    const body = {
          "limit": 100,
          "offset": 0
    }

    const response = await fetch(thread.theurl+'/project/getExecutorsTasks', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        thread.lastresp = data.data;
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /project/getExecutorsTasks



// /task/create

const taskCreate = async (thread, theProjectId, theuserId) =>{
    const body = {
       "projectId": theProjectId,
       "taskData": {
          "id": 0,
          "title": "string",
          "info": "string",
          "groupId": 0,
          "startTime": new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          "endTime": new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
          "timeType": "later",
          "regular": {
             "enabled": false,
             "rule": "weekdays",
             "weekdaysList": [
                1,
                2
             ],
             "origTaskId": 1
          },
          "userList": [
             {
                "userId": theuserId,
                "role": "",
                "status": ""
             }
          ],
          "hashtagList": [
              {
                 "name": "family"
              }
          ],
          "extSource": "Google Calendar",
          "extDestination": "Telegram: 9266541231",
          "execEndTime": new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
          "execUserId": thread.userId,
          "tickList": [
             {
                "text": "string",
                "status": "ready"
             }
          ]
       }
    }
    const response = await fetch(thread.theurl+'/task/create', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', 'Cookie': thread.cookie}
    });

    try {
        checkStatus(response);
        const data = await response.json();
        thread.lastresp = data.data;
        return thread;
    } catch (error) {
        console.error(error);
        const errorBody = await error.response.text();
        console.error(`Error body: ${errorBody}`);
    }
}
// end /task/create




// end ROUTES

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


async function test1(){
    //шаг 1. /user/auth (для обоих юзеров)
    //шаг 2. /user/code (для обоих юзеров)
    //шаг 3. /user/session (для обоих юзеров)
    //шаг 4. /project/create (для юзера №1)
    //шаг 5. /project/addUser (для юзера №1)
    //шаг 6. /user/getOne (для юзера №2 - у него должен появиться проект из п.5)
    //шаг 7. /project/transfer (для юзера №1)
    //шаг 8. /project/getOne (для юзера №2 - он должен стать владельцем проекта)


    let threadOne = { theurl: "http://localhost:3000", phone: "9265126677"};
    let threadTwo = { theurl: "http://localhost:3000", phone: "9265126672"};


    threadOne = await userAuth(threadOne);
    threadOne = await userCode(threadOne);
    threadOne = await userSession(threadOne);
    threadOne = await projectCreate(threadOne);
    let theProjectId = threadOne.lastresp.id;
    console.log('CREATED PROJEST ID: ' + theProjectId);

    threadTwo = await userAuth(threadTwo);
    threadTwo = await userCode(threadTwo);
    threadTwo = await userSession(threadTwo);

    threadOne = await projectAddUser(threadOne, theProjectId, threadTwo.userId);
    threadTwo = await userGetOne(threadTwo);
    console.log(threadTwo.lastresp.projectList);

    if(threadTwo.lastresp.projectList.some(elem => ( elem.projectId == theProjectId && elem.role == "member" && elem.userId == threadTwo.userId ))){
        console.log( "projectAddUser OK!!");
    }

    threadOne = await projectTransfer(threadOne, threadTwo.userId);
    threadTwo = await projectGetOne(threadTwo, threadOne.projectId);
    console.log(threadTwo.lastresp.userList);

    if(threadTwo.lastresp.userList.some(elem => ( elem.projectId == theProjectId && elem.role == "owner" && elem.userId == threadTwo.userId ))){
        console.log('FINAL OK!!!');
    }
}


async function test2(){
    //шаг 1. /user/auth (для обоих юзеров)
    //шаг 2. /user/code (для обоих юзеров)
    //шаг 3. /user/session (для обоих юзеров)
    //шаг 4. /project/addUser (для юзера №1)
    //шаг 5. /task/create (для юзера №1 с указанием исполнителем юзера №2)
    //шаг 6. /project/getExecutorsTasks (для юзера №1 - проверить что задача в этом списке)
    //шаг 7. /user/changeCurrentProject (для юзера №2)
    //шаг 8. /project/getInboxTasks (для юзера №2 - проверить что задача в этом списке)
    //шаг 9. /project/update (для юзера №2 с указанием времени с отметкой о взятии в работу)
    //шаг 10. /project/getScheduleTasks (для юзера №2 - проверить что задача теперь в этом списке)
    //шаг 11. /task/execute (для юзера №2)
    //шаг 12. /project/getInboxTasks (для юзера №1 - проверить что задача в этом списке)
    //шаг 13. /task/execute (для юзера №1)
    //шаг 14. /project/getOne (для юзера №1 - проверить что у задачи установлены exec-параметры)


    let threadOne = { theurl: "http://localhost:3000", phone: "9265126611"};
    let threadTwo = { theurl: "http://localhost:3000", phone: "9265126622"};


    threadOne = await userAuth(threadOne);
    threadOne = await userCode(threadOne);
    threadOne = await userSession(threadOne);
    let theProjectId = threadOne.lastresp.currentProjectId;
    console.log('THE PROJEST ID: ' + theProjectId);

    threadTwo = await userAuth(threadTwo);
    threadTwo = await userCode(threadTwo);
    threadTwo = await userSession(threadTwo);

    threadOne = await projectAddUser(threadOne, theProjectId, threadTwo.userId);
    console.log(threadOne);

    threadOne = await taskCreate(threadOne, theProjectId, threadTwo.userId);
    console.log(threadOne);

    threadOne = await projectGetExecutorsTasks(threadOne);
    console.log(threadOne);

}

test2();





//test1();