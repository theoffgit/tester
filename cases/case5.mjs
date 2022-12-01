import { getFakeUsers, theFetch } from "../apitester.mjs";

//Кейс №5 "Проверить Wish"
//1. СОЗДАТЬ ЮЗЕРА (юзер №1)
//2. СОЗДАТЬ ЮЗЕРА (юзер №2)
//3. юзер №1: WishCreate
//4. юзер №1: WishCreate
//5. юзер №2: WishesGetByUserId (с ID из шага №1) - должно быть два подарка
//6. юзер №1: WishListCreate (в wish_ids ID из шагов [3,4])
//7. юзер №1: WishCreate - в wish_list_ids ID из шага №6
//8. юзер №1: WishListGetByID (с ID из шага №6) - в wishes должно быть три подарка (с ID из шагов [3,4,7])
//9. юзер №1: WishListCreate (в wish_ids ID из шагов [3,4,7])
//10. юзер №1: WishUpdate (с ID из шага №7) - изменить параметр price + в wish_list_ids ID из шагов [6,9]
//11. юзер №1: WishGetByID (с ID из шага №7) - должен быть измененный параметр price + два списка подарков в wish_lists
//12. юзер №1: WishListUpdate (с ID из шага №6) - в wish_ids ID из шагов [3,4,7] + изменить параметр title
//13. юзер №1: WishListsGet - должно быть два списка подарков, в каждом из которых по 3 подарка (с ID из шагов [3,4,7]) + в списке с ID из шага №9 должен быть новый title
//14. юзер №1: WishDelete (с ID из шага №4)
//15. юзер №1: WishesGet - должно быть два подарка
//16. юзер №1: WishListDelete (с ID из шага №9)
//17. юзер №2: WishListsGetByUserId (с ID из шага №1) - должен остаться один список подарков, в котором два подарка




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

    console.log('//3. юзер №1: WishCreate)');
    threadOne = await theFetch(
        "WishCreate",
        {
            secret: 0,
            stars: 4,
            title: "мобильный телефон iPhone 14",
            tags: '["phone","apple","pikachu"]',
            where_to_buy: "https://www.amazon.com/Tech21-iPhone-Sparkle-Compatible-MagSafe%C2%AE/dp/B0B9CHBS8X/ref=sr_1_4?keywords=mobile%2Bphones%2Biphone%2B14&qid=1666706875&qu=eyJxc2MiOiIxLjIzIiwicXNhIjoiMC4wMCIsInFzcCI6IjAuMDAifQ%3D%3D&sr=8-4&th=1",
            price: "150000.00",
            description: "Товар очень крутой.",
//            wish_list_ids: '[3,4,5]',
        },
        threadOne
    );
    const wishId = threadOne.lastresp.id;
    console.log('//4. юзер №1: WishCreate)');
    threadOne = await theFetch(
        "WishCreate",
        {
            secret: 0,
            stars: 4,
            title: "мобильный телефон iPhone 14",
            tags: '["phone","apple","pikachu"]',
            where_to_buy: "https://www.amazon.com/Tech21-iPhone-Sparkle-Compatible-MagSafe%C2%AE/dp/B0B9CHBS8X/ref=sr_1_4?keywords=mobile%2Bphones%2Biphone%2B14&qid=1666706875&qu=eyJxc2MiOiIxLjIzIiwicXNhIjoiMC4wMCIsInFzcCI6IjAuMDAifQ%3D%3D&sr=8-4&th=1",
            price: "150000.00",
            description: "Товар очень крутой.",
//            wish_list_ids: '[3,4,5]',
        },
        threadOne
    );
    const wishId2 = threadOne.lastresp.id;
    console.log('//5. юзер №2: WishesGetByUserId (с ID из шага №1) - должно быть два подарка');
    threadOne = await theFetch(
        "WishesGetByUserId",
        {
            user_id: threadOne.user.id,
        },
        threadOne,
        (result) => {
            return (
                      result.wishes.length == 2 &&
                      result.wishes.some(el => (el.id == wishId)) &&
                      result.wishes.some(el => (el.id == wishId2))
                   );
        }
    );
    console.log('//6. юзер №1: WishListCreate (в wish_ids ID из шагов [3,4])');
    threadOne = await theFetch(
        "WishListCreate",
        {
            title: "подарки на ДР",
            locked: 0,
            wish_ids: '['+wishId+','+wishId2+']',
        },
        threadOne
    );
    const wishListId = threadOne.lastresp.id;
    console.log('//7. юзер №1: WishCreate - в wish_list_ids ID из шага №6');
    threadOne = await theFetch(
        "WishCreate",
        {
            secret: 0,
            stars: 4,
            title: "мобильный телефон iPhone 14",
            tags: '["phone","apple","pikachu"]',
            where_to_buy: "https://www.amazon.com/Tech21-iPhone-Sparkle-Compatible-MagSafe%C2%AE/dp/B0B9CHBS8X/ref=sr_1_4?keywords=mobile%2Bphones%2Biphone%2B14&qid=1666706875&qu=eyJxc2MiOiIxLjIzIiwicXNhIjoiMC4wMCIsInFzcCI6IjAuMDAifQ%3D%3D&sr=8-4&th=1",
            price: "150000.00",
            description: "Товар очень крутой.",
            wish_list_ids: '['+wishListId+']',

        },
        threadOne
    );
    const wishId3 = threadOne.lastresp.id;
    console.log('//8. юзер №1: WishListGetByID (с ID из шага №6) - в wishes должно быть три подарка (с ID из шагов [3,4,7])');
    threadOne = await theFetch(
        "WishListGetByID",
        {
            id: wishListId,
        },
        threadOne,
        (result) => {
            return (
                      result.wish_list.wishes.length == 3 &&
                      result.wish_list.wishes.some(el => (el.id == wishId)) &&
                      result.wish_list.wishes.some(el => (el.id == wishId2)) &&
                      result.wish_list.wishes.some(el => (el.id == wishId3))
                   );
        }

    );
    const messId = threadOne.lastresp.id;
    console.log('//9. юзер №1: WishListCreate (в wish_ids ID из шагов [3,4,7])');
    threadOne = await theFetch(
        "WishListCreate",
        {
            title: "подарки на ДР",
            locked: 0,
            wish_ids: '['+wishId+','+wishId2+','+wishId3+']',
        },
        threadOne
    );
    const wishListId2 = threadOne.lastresp.id;
    console.log('//10. юзер №1: WishUpdate (с ID из шага №7) - изменить параметр price + в wish_list_ids ID из шагов [6,9]');
    threadOne = await theFetch(
        "WishUpdate",
        {
            id: wishId3,
            secret: 1,
            stars: 5,
            title: "мобильный телефон iPhone 14 updated",
            tags: '["phone","apple","pikachu", "zelobu"]',
            where_to_buy: "https://www.amazon.com/someuri/",
            price: "120.00",
            description: "Товар очень крутой. Updated",
            wish_list_ids: '['+wishListId+','+wishListId2+']',
        },
        threadOne
    );
    console.log('/11. юзер №1: WishGetByID (с ID из шага №7) - должен быть измененный параметр price + два списка подарков в wish_lists');
    threadOne = await theFetch(
        "WishGetByID",
        {
            id: wishId3,
        },
        threadOne,
        (result) => {
            return (
                        result.wish.price == "120.00" &&
                        result.wish.wish_lists.length == 2
                   );
        }
    );
    console.log('//12. юзер №1: WishListUpdate (с ID из шага №6) - в wish_ids ID из шагов [3,4,7] + изменить параметр title');
    threadOne = await theFetch(
        "WishListUpdate",
        {
            id: wishListId,
            title: "zeloTitle",
            locked: 0,
            wish_ids: '['+wishId+','+wishId2+','+wishId3+']',
        },
        threadOne
    );
    console.log('//13. юзер №1: WishListsGet - должно быть два списка подарков, в каждом из которых по 3 подарка (с ID из шагов [3,4,7]) + в списке с ID из шага №9 должен быть новый title');
    threadOne = await theFetch(
        "WishListsGet",
        {},
        threadOne,
        (result) => {
            return (
                        result.wish_lists.length == 2 &&
                        result.wish_lists[0].wish.length == 3 &&
                        result.wish_lists[1].wish.length == 3 &&
                        result.wish_lists.some(el => (el.id == wishListId2 && el.title == "zeloTitle"))
                   );
        }
    );
    console.log('//14. юзер №1: WishDelete (с ID из шага №4)');
    threadOne = await theFetch(
        "WishDelete",
        {
            id: wishId2,
        },
        threadOne
    );
    console.log('//15. юзер №1: WishesGet - должно быть два подарка');
    threadOne = await theFetch(
        "WishesGet",
         {},
         threadOne,
        (result) => {
            return (
                        result.wishes.length == 2
                   );
        }
    );
    console.log('//16. юзер №1: WishListDelete (с ID из шага №9)');
    threadOne = await theFetch(
        "WishListDelete",
        {
            id: wishListId2,
        },
        threadOne
    );
    console.log('//17. юзер №2: WishListsGetByUserId (с ID из шага №1) - должен остаться один список подарков, в котором два подарка');
    threadTwo = await theFetch(
        "WishListsGetByUserId",
        {
            user_id: threadOne.user.id,
        },
        threadTwo,
        (result) => {
            return (
                        result.wish_lists.length == 1 &&
                        result.wish_lists[0].wishes.length == 1
                   );
        }
    );
}
