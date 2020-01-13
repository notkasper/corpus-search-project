const JWT = require('jsonwebtoken');
const request = require('superagent');
const config = require('../../config.json');

const requiredProperties = ['word', 'lemma', 'pos', 'total_frequency', 'group_0', 
    'group_1', 'group_2', 'group_3', 'group_4', 'group_5', 
    'group_6', 'group_7', 'group_8', 'VO_1', 'VO_2'];
const secret = config.SECRET;
const token = JWT.sign({ "username": "admin" }, secret);

describe('/GET frequency/basilex/words', async () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });
    test('When given an existing word return all required word information', async () => {
        const word = "[\"en\"]";
        const response = await request
            .get(`localhost:8080/frequency/basilex/words/0`)
            .query({ queries: [word], strict: true, searchMode: 'word' })
            .set("x-access-token", token)
            .send();

        expect(response.status).toEqual(200);
        response.body.result.forEach(word => {
            requiredProperties.forEach(requirement => {
                expect(word[requirement]).toBeDefined();
            });
        });
    });

    test('When a non-word query has been specified, return 200 with no results', async () => {
        const word = "[\".2#9fksl\"]";
        const response = await request
            .get(`localhost:8080/frequency/basilex/words/0`)
            .query({ queries: [word], strict: true, searchMode: 'word' })
            .set("x-access-token", token)
            .send();

        expect(response.status).toEqual(200);
        expect(response.body.result.length).toEqual(0);
    });
});

describe('/GET frequency/basiscript/words', async () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });
    test('When given an existing word return all required word information', async () => {
        const word = "[\"en\"]";
        const response = await request
            .get(`localhost:8080/frequency/basiscript/words/0`)
            .query({ queries: [word], strict: true, searchMode: 'word' })
            .set("x-access-token", token)
            .send();

        expect(response.status).toEqual(200);
        response.body.result.forEach(word => {
            requiredProperties.forEach(requirement => {
                expect(word[requirement]).toBeDefined();
            });
        });
    });

    test('When a non-word query has been specified, return 200 with no results', async () => {
        const word = "[\".2#9fksl\"]";
        const response = await request
            .get(`localhost:8080/frequency/basiscript/words/0`)
            .query({ queries: [word], strict: true, searchMode: 'word' })
            .set("x-access-token", token)
            .send();

        expect(response.status).toEqual(200);
        expect(response.body.result.length).toEqual(0);
    });
});