import { getFakeUsers, theFetch } from "../apitester.mjs";


//Кейс №6 "Проверить Gift
//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. СОЗДАТЬ ЮЗЕРА (юзер №2)
//3. юзер №1: GiftCreate
//4. юзер №1: GiftCreate
//5. юзер №1: GiftCreate
//6. юзер №1: GiftUpdate (с ID из шага №3) - изменить параметр price
//7. юзер №1: GiftGetByID (с ID из шага №3) - должен быть измененный параметр price
//8. юзер №1: GiftsGet - должно быть три подарка
//9. юзер №1: GiftDelete (с ID из шага №4)
//10. юзер №2: GiftsGetByUserID (с ID из шага №1) - должно быть два подарка


export default async function () {
    const [{ phone: phone1 }, { phone: phone2 }] = getFakeUsers(2);

    let threadOne = { phone: phone1, cookie: null};
    let threadTwo = { phone: phone2, cookie: null};

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

    console.log('//3. юзер №1: GiftCreate');
    threadOne = await theFetch(
        "GiftCreate",
        {
            stars: 4,
            title: "часы Победа",
            tags: '["часы","Победа"]',
            where_to_buy: "ларек за углом",
            price: "10000.00",
            description: "Товар просто супер.",
            contact_id: threadOne.user.id,
            date: "2022-12-12",
        },
        threadOne
    );
    const giftId = threadOne.lastresp.id;
    console.log('/4. юзер №1: GiftCreate');
    threadOne = await theFetch(
        "GiftCreate",
        {
            stars: 5,
            title: "часы Победа 2",
            tags: '["часы","Победа"]',
            where_to_buy: "ларек за углом",
            price: "12000.00",
            description: "Товар просто супер 2.",
            contact_id: threadOne.user.id,
            date: "2022-12-12",
        },
        threadOne
    );
    const giftId2 = threadOne.lastresp.id;
    console.log('/5. юзер №1: GiftCreate');
    threadOne = await theFetch(
        "GiftCreate",
        {
            stars: 3,
            title: "часы Победа 3",
            tags: '["часы","Победа"]',
            where_to_buy: "ларек за углом 3",
            price: "13000.00",
            description: "Товар просто супер 3.",
            contact_id: threadOne.user.id,
            date: "2022-12-12",
        },
        threadOne
    );
    const giftId3 = threadOne.lastresp.id;

    console.log('//6. юзер №1: GiftUpdate (с ID из шага №3) - изменить параметр price');
    threadOne = await theFetch(
        "GiftUpdate",
        {
            if: giftId,
            stars: 2,
            title: "часы Победа updated",
            tags: '["часы","Победа"]',
            where_to_buy: "ларек за углом updated",
            price: "999.00",
            description: "Товар просто супер. Updated",
            contact_id: threadOne.user.id,
            date: "2022-12-12",
        },
        threadOne
    );
    console.log('//7. юзер №1: GiftGetByID (с ID из шага №3) - должен быть измененный параметр price');
    threadOne = await theFetch(
        "GiftGetByID",
        {
            id: giftId,
        },
        threadOne,
        (result) => {
            return (
                      result.gift.price == "999.00"
                   );
        }
    );
    const messId = threadOne.lastresp.id;
    console.log('//8. юзер №1: GiftsGet - должно быть три подарка');
    threadOne = await theFetch(
        "GiftsGet",
        {},
        threadOne,
        (result) => {
            return (
                      result.gifts.length == 3
                   );
        }
    );
    console.log('//9. юзер №1: GiftDelete (с ID из шага №4)');
    threadOne = await theFetch(
        "GiftDelete",
        {
            id: giftId2,
        },
        threadOne
    );
    console.log('//10. юзер №2: GiftsGetByUserID (с ID из шага №1) - должно быть два подарка');
    threadTwo = await theFetch(
        "GiftsGetByUserID",
        {
            user_id: threadOne.user.id,
        },
        threadTwo,
        (result) => {
            return (
                        result.giftss.length == 2
                   );
        }
    );
}
