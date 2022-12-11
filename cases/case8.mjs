import { getFakeUsers, theFetch } from "../apitester.mjs";


//Кейс №6 "Проверить Gift
//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. юзер №1: CongratulationTemplateCreate
//3. юзер №1: CongratulationTemplateGetByID c congratulation_template_id из шага 2
//4. юзер №1: CongratulationTemplatesGet в ответе должно быть поздравление из шага 2
//5. юзер №1: CongratulationTemplateUpdate c congratulation_template_id из шага 2
//6. юзер №1: CongratulationTemplateGetByID c congratulation_template_id из шага 2
//7. юзер №1: CongratulationTemplateDelete c congratulation_template_id из шага 2
//8. юзер №1: CongratulationTemplatesGet в ответе должно быть пусто


export default async function () {
    const [{ phone: phone1 }] = getFakeUsers(1);


    let threadOne = { phone: phone1, cookie: null};

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


    console.log('//2. юзер №1: CongratulationTemplateCreate');
    threadOne = await theFetch(
        "CongratulationTemplateCreate",
        {
            text: "текст поздравления для шаблона",
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      result.congratulation_template_id > 0
                   );
        }
    );
    const congratulationTemplateId = threadOne.lastresp.congratulation_template_id;

    console.log('//3. юзер №1: CongratulationTemplateGetByID c congratulation_template_id из шага 2');
    threadOne = await theFetch(
        "CongratulationTemplateGetByID",
        {
            congratulation_template_id: congratulationTemplateId,
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      typeof(result.congratulation_template) == "object"
                   );
        }
    );

    console.log('//4. юзер №1: CongratulationTemplatesGet в ответе должно быть поздравление из шага 2');
    threadOne = await theFetch(
        "CongratulationTemplatesGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.status === 0 &&
                      result.congratulation_templates.length > 0 &&
                      result.congratulation_templates.some(el => (el.id == congratulationTemplateId))
                   );
        }
    );

    console.log('//5. юзер №1: CongratulationTemplateUpdate c congratulation_template_id из шага 2');
    threadOne = await theFetch(
        "CongratulationTemplateUpdate",
        {
            congratulation_template_id: congratulationTemplateId,
            text: "текст поздравления для темлейта. изменено.",

        },
        threadOne,
        (result) => {
            return (
                      result.status === 0
                   );
        }
    );

    console.log('//6. юзер №1: CongratulationTemplateGetByID c congratulation_template_id из шага 2');   // проверяем, что текст изменился
    threadOne = await theFetch(
        "CongratulationTemplateGetByID",
        {
            congratulation_template_id: congratulationTemplateId,
        },
        threadOne,
        (result) => {
            return (
                      result.congratulation_template.id == congratulationTemplateId &&
                      result.congratulation_template.text == "текст поздравления для темлейта. изменено."
                   );
        }
    );

    console.log('//7. юзер №1: CongratulationTemplateDelete c congratulation_template_id из шага 2');
    threadOne = await theFetch(
        "CongratulationTemplateDelete",
        {
            congratulation_template_id: congratulationTemplateId,
        },
        threadOne,
        (result) => {
            return (
                      result.status === 0
                   );
        }
    );


    console.log('//8. юзер №1: CongratulationTemplatesGet не должно быть поздравлений');
    threadOne = await theFetch(
        "CongratulationTemplatesGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.congratulation_templates.length == 0
                   );
        }
    );



}
