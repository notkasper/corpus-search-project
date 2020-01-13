/*
    Tests for the partialqueryparser, in the queryHandler.js file
    main thing to test for is that a large query consisting of multiple smaller queries 
    is turned into an array filled with the partial queries as strings.
*/
const queryHandler = require("../handlers/queryHandler");


const simpleWordQuery = "[word=\"rood\"]";
const simpleWordQueryExpResult = ["[word=\"rood\"]"];

const twoWordQuery = "[word=\"rood\"][word=\"blauw\"]";
const twoWordQueryExpResult = ["[word=\"rood\"]", "[word=\"blauw\"]"];

const simpleLemmaQuery = "[lemma=\"fietsen\"]";
const simpleLemmaQueryExpResult = ["[lemma=\"fietsen\"]"];

const twoLemmaQuery = "[lemma=\"fietsen\"][lemma=\"tekenen\"]";
const twoLemmaQueryExpResult = ["[lemma=\"fietsen\"]", "[lemma=\"tekenen\"]"];


//PoS tests should be added in the future

const mixedQuery = "[][word=\"rood\"][][lemma=\"rennen\"][][]";
const mixedQueryExpResult = ["[]", "[word=\"rood\"]", "[]", "[lemma=\"rennen\"]", "[]", "[]"];

//operators

//repetition
const queryRepetitionOperator = "[word=\"rood\"]{0,3}[word=\"blauw\"]{1,2}[lemma=\"rennen\"]";
const queryRepetitionOperatorExpResult = ["[word=\"rood\"]{0,3}", "[word=\"blauw\"]{1,2}", "[lemma=\"rennen\"]"];

//wildcards
const queryWildcardOperator = "[word=\"rood|blauw\"][word=\"k.*nnen|l.*pen\"][lemma=\"tekenen\"]";
const queryWilcardOperatorExpResult = ["[word=\"rood|blauw\"]", "[word=\"k.*nnen|l.*pen\"]", "[lemma=\"tekenen\"]"];
//ANDoperator
const queryAndOperator = "[lemma=\"eten\"]&[pos=\"N.*|WW.*\"][word=\"bieten\"]";
const queryAndOperatorExpResult = ["[lemma=\"eten\"]&[pos=\"N.*|WW.*\"]", "[word=\"bieten\"]"];

//ORoperator
const queryOrOperator = "[word=\"rood\"]|[word=\"blauw\"][word=\"auto\"][lemma=\"rijden\"]";
const queryOrOperatorExpResult = ["[word=\"rood\"]|[word=\"blauw\"]", "[word=\"auto\"]", "[lemma=\"rijden\"]"];


//words tests
describe("Query to partial queries parser tests", () => {
  describe('A query of words should be parsed in to an array of partial word queries', () => {
    test("When given a query consisting of one word, an array with one word (partial)query should be returned", () => {
      expect(queryHandler.partialQueryParser(simpleWordQuery)).toEqual(simpleWordQueryExpResult);
    });

    test("When given a query consisting of multiple words, an array with multiple partial queries should be returned", () => {
      expect(queryHandler.partialQueryParser(twoWordQuery)).toEqual(twoWordQueryExpResult);
    });
  });
  //lemma tests
  describe("A query of one lemmas should be parsed in to an array of partial lemma queries", () => {
    test("When given a query consisting of one lemma, an array with one lemma (partial)query should be returned", () => {
      expect(queryHandler.partialQueryParser(simpleLemmaQuery)).toEqual(simpleLemmaQueryExpResult);
    });

    test("When given a query consisting of multiple lemmas, an array with multiple partial queries should be returned", () => {
      expect(queryHandler.partialQueryParser(twoLemmaQuery)).toEqual(twoLemmaQueryExpResult);
    });
  });

  //mixed queries tests
  describe("A mixed query should be parsed in to an array of partial queries", () => {

    test("When given queries consisting of words,lemmas and empty queries, an array with those partialised queries should be returned ", () => {
      expect(queryHandler.partialQueryParser(mixedQuery)).toEqual(mixedQueryExpResult);
    });
    //operator tests
    describe("A mixed query special operators should be parsed in parties queries", () => {

      test.skip("When given mixed queries with the repetition operator, an array with partial querries with the repition operator appended to the appriate partial query should be returned", () => {
        expect(queryHandler.partialQueryParser(queryRepetitionOperator)).toEqual(queryRepetitionOperatorExpResult);
      });

      test("When a query contains wildcards, an array of partial queries with the wildcard operator appended to the appriate partial query should be returned", () => {
        expect(queryHandler.partialQueryParser(queryWildcardOperator)).toEqual(queryWilcardOperatorExpResult);
      });

      test("When a query contains the AND operator, an array of partial queries with the AND operator appended to the appriate partial query should be returned", () => {
        expect(queryHandler.partialQueryParser(queryAndOperator)).toEqual(queryAndOperatorExpResult);
      });

      test("When a query contains the OR operator, an array of partial queries with the OR operator appended to the appriate partial query should be returned", () => {
        expect(queryHandler.partialQueryParser(queryOrOperator)).toEqual(queryOrOperatorExpResult);
      })
    });

  });
});



