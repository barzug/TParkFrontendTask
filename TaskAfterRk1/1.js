
/*
 * Есть 2 метода API, адрес https://example.com
 * 1. GET /api/v1/books
 * 2. GET /api/v1/movies
 * Оба метода возвращают JSON, интерфейс ответа:
 *
 * interface IApiAnswer {
 *   data?: IItem[];
 *   error?: IApiError;
 * }
 *
 * interface IApiError {
 *   message?: string;
 * }
 *
 * interface IItem {
 *   id: number;
 *   title: string;
 * }
 *
 *
 * Задача: сделать 2 CORS запроса, используя fetch api
 * В случае ошибки хотя бы одного вывести в консоль message ошибки,
 * если есть, или заглушку (любую, придумать)
 * В случае успеха выбрать массив наименьшей длины, отсортировать по убыванию id и вывести в консоль
 */

'use strict';

const BASE_URL = 'https://example.com';

const GET_BOOKS_DEFAULT_ERROR_MESSAGE = 'Unknown error on /api/v1/books';
const GET_MOVIES_DEFAULT_ERROR_MESSAGE = 'Unknown error on /api/v1/movies';

/*
* Выполняет GET-запрос по указанному адресу и урлу, заданному в константе.
* пробрасывает дальше data ответа или ошибку с полученным message-ом или сообщением по умолчанию
* @param {string} adress - адрес запроса
* @param {string} defaultErrorMessage - сообщение об ошибке по умолчанию
* @return {Promise}
*/
getData = (adress, defaultErrorMessage) => {
    return Get(BASE_URL + adress)
        .then(responseJson => {
            return responseJson.data
        })
        .catch(err => {
            if (err.error !== undefined) {
                throw err.error.message || defaultErrorMessage;
            } else {
                throw defaultErrorMessage;
            }
        });

};

/*
* Выполняет GET-запрос по указанному адресу с использованием fetch
* @param {string} url - адрес запроса
* @return {Promise}
*/
Get = url => {
    return fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
        .then(response => {
            let json = response.json();
            if (response.status >= 400) {
                return json.then(response => { throw response; });
            }
            return json;
        });
};

/*
* Основная функция задания. Делает запросы. Выводит в консоль ошибку или необходимый массив
*/
taskFunction = () => {
    Promise.all([
        getData('/api/v1/books', GET_BOOKS_DEFAULT_ERROR_MESSAGE),
        getData('/api/v1/movies', GET_MOVIES_DEFAULT_ERROR_MESSAGE),
    ]).then(responses => {
        let resultArray = responses[0];
        responses.forEach(response => {
            if (response.length < resultArray.length) {
                resultArray = response;
            }
        });

        resultArray.sort((a, b) => {
            return +b.id - +a.id;
        });
        console.log(resultArray)
    })
        .catch(err => {
            console.error(err);
        })
};

taskFunction();