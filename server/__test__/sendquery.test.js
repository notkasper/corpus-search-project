const JWT = require('jsonwebtoken');
const request = require('superagent');
const config = require('../../config.json');

const secret = config.SECRET;
const token = JWT.sign({ "username": "admin" }, secret);

/**
 * Generates all possible combinations of boolean values, dependent on the amount 
 * of filters, where each time, only one value is true and the rest false.
 * This way, only one filter gets selected per test loop.
 * 
 * Example: [[false, true, true], [true, false, true], [true, true, false]]
 * 
 * @param {Object} filterValues 
 */
const generateBooleanCombinations = (filterValues) => {
  let result = [];

  for (let x = 0; x < filterValues.length; x += 1) {
    let values = [];
    for (let y = 0; y < filterValues.length; y += 1) {
      values[y] = x === y;
    }

    let possibleFilterValues = {};
    filterValues.map((grade, index) => {
      possibleFilterValues[grade] = values[index];
    });
    result.push(possibleFilterValues);
  }
  return result;
}

describe('/POST cql_query', async () => {

  beforeEach(() => jest.setTimeout(60000));

  test('When given an existing word return all required word information', async () => {
    const response = await request
      .post(`localhost:8080/cql_query/basilex/0`)
      .set("x-access-token", token)
      .send({
        query: `[word=".*"]`,
        grades: {
          '0': true,
          '1': true,
          '2': true,
          '3': true,
          '4': true,
          '5': true,
          '6': true,
          '7': true,
          '8': true,
          '1VO': true,
          '2VO': true,
        },
        documents: {
          ondertitels: true,
          leesboek: true,
          zaakvakmethode: true,
          newsfeed: true,
          toets: true,
          strip: true,
          rekenmethode: true,
          taalmethode: true,
        }
      });

    const { result } = response.body;
    expect(response.status).toEqual(200);
    expect(result.length).toEqual(20);
  });

});

describe('Test all possible filter combinations for BasiLex', async () => {

  test('Test all grade filter combinations', async () => {
    const gradeHeaders = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '1VO', '2VO'];
    const gradeFilterCombinations = generateBooleanCombinations(gradeHeaders);

    for (const combination of gradeFilterCombinations) {
      const expectedGrade = Object.keys(combination).find(key => combination[key] === true);

      const response = await request
        .post('localhost:8080/cql_query/basilex/0')
        .set('x-access-token', token)
        .send({
          query: `[word=".*"]`,
          grades: combination,
          documents: {
            ondertitels: true,
            leesboek: true,
            zaakvakmethode: true,
            newsfeed: true,
            toets: true,
            strip: true,
            rekenmethode: true,
            taalmethode: true,
          }
        });

      const { result } = response.body;
      for (const tableRow of result) {
        const { targets } = tableRow;
        for (const target of targets) {
          const { frog_id } = target;
          const frogInformation = await request
            .get(`localhost:8080/frog/basilex/${frog_id}/file`)
            .set('x-access-token', token)
            .send();

          expect(frogInformation.body.result.grade).toEqual(expectedGrade);
        }
      }
    }
  });

  test('Test all document filter combinations', async () => {
    const documentHeaders = ['ondertitels', 'leesboek', 'zaakvakmethode', 'newsfeed', 'toets', 'strip', 'rekenmethode', 'taalmethode'];
    const documentFilterCombinations = generateBooleanCombinations(documentHeaders);

    for (const combination of documentFilterCombinations) {
      const expectedDocument = Object.keys(combination).find(key => combination[key]);

      const response = await request
        .post('localhost:8080/cql_query/basilex/0')
        .set('x-access-token', token)
        .send({
          query: `[word=".*"]`,
          grades: {
            '0': true,
            '1': true,
            '2': true,
            '3': true,
            '4': true,
            '5': true,
            '6': true,
            '7': true,
            '8': true,
            '1VO': true,
            '2VO': true,
          },
          documents: combination
        });

      const { result } = response.body;
      for (const tableRow of result) {
        const { targets } = tableRow;
        for (const target of targets) {
          const { frog_id } = target;
          const frogInformation = await request
            .get(`localhost:8080/frog/basilex/${frog_id}/file`)
            .set('x-access-token', token)
            .send();

          expect(frogInformation.body.result.document_type).toEqual(expectedDocument);
        }
      }
    }

  });

});