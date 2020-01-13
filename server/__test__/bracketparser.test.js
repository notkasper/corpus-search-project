/**
 * This test suite contains tests for the bracketparser in the queryHandler.js file.
 * Important to test here is that the queries that contain operators are seperated correctly
 * 
 * TODOs:
 * 1) Configure that bracketparser such that it also can parse the REP operator ({a,b})
 * 2) PoS is not yet implemented in the bracketparser, thus it cannot be tested yet
 *    => This PoS is breaking because of capitals
 */
const queryHandler = require("../handlers/queryHandler");

describe("BRACKETPARSER TESTS", () => {

  describe("Queries ending with an operator", () => {

    test("When query ends with AND operator it should return query without any operator", () => {
      const bracketParserWeirdQueryAnd = "[word=\"rood\"]&";
      expect(queryHandler.bracketParser(bracketParserWeirdQueryAnd)).toEqual({ 
        "operator": null, 
        "queries": [
          ["[word=\"rood\"]&"]
        ]
      });
    });

    test("When query ends with OR operator it should return query without any operator", () => {
      const bracketParserWeirdQueryOr = "[word=\"rood\"]|";
      expect(queryHandler.bracketParser(bracketParserWeirdQueryOr)).toEqual({ 
        "operator": null, 
        "queries": [
          ["[word=\"rood\"]|"]
        ] 
      });
    });

  });

  describe("Queries containing a single operator", () => {

    test("When a Query has single AND operator it should return an array of queries and an operator variable assigned &", () => {
      const bracketParserAndOperator = "[word=\"rood\"]&[word=\"blauw\"]";
      expect(queryHandler.bracketParser(bracketParserAndOperator)).toEqual({ 
        "operator": "&", 
        "queries": [
          ["[word=\"rood\"]", "[word=\"blauw\"]"]
        ]
      });
    });

    test("When a Query has single OR operator it should return an array of queries and an operator variable assigned |", () => {
      const bracketParserOrOperator = "[word=\"rood\"]|[word=\"blauw\"]";
      expect(queryHandler.bracketParser(bracketParserOrOperator)).toEqual({ 
        "operator": "|", 
        "queries": [
          ["[word=\"rood\"]", "[word=\"blauw\"]"]
        ]
      });
    });

    // TODO: Not yet implemented!
    test.skip("When a Query has single REP operator it should return an array of queries and an operator variable assigned {a,b}", () => {
      const bracketParserRepOperator = "[word=\"rood\"]{0,3}";
      expect(queryHandler.bracketParser(bracketParserRepOperator)).toEqual({
        "operator": "{0,3}",
        "queries": [
          ["[word=\"rood\"]"]
        ]
      });
    });

  })

  describe("Queries containing more than one operator", () => {

    test("When a query contains both an AND and an OR it should return those operators and the queries", () => {
      const bracketMixOperatorsAndFirst = "[word=\"rood\"]&([word=\"rood\"]|[word=\"blauw\"])";
      expect(queryHandler.bracketParser(bracketMixOperatorsAndFirst)).toEqual({ 
        "operator": "&", 
        "queries": [
          ["[word=\"rood\"]"], { 
            "operator": "|",
            "queries": [
              ["[word=\"rood\"]", "[word=\"blauw\"]"]
            ] 
          }
        ] 
      });
    });

    test("When a query contains both an OR and an AND it should return those operators and the queries", () => {
      const bracketMixOperatorsOrFirst = "[word=\"rood\"]|([word=\"groen\"]&[word=\"blauw\"])";
      expect(queryHandler.bracketParser(bracketMixOperatorsOrFirst)).toEqual({ 
        "operator": "|", 
        "queries": [
          ["[word=\"rood\"]"], { 
            "operator": "&", 
            "queries": [
              ["[word=\"groen\"]", "[word=\"blauw\"]"]
            ] 
          }
        ] 
      });
    });

    test("When a query contains multiple AND operators it should return an AND operator and the queries", () => {
      const bracketParserMulipleAnd = "[word=\"rood\"]&[word=\"groen\"]&[word=\"blauw\"]";
      expect(queryHandler.bracketParser(bracketParserMulipleAnd)).toEqual({ 
        "operator": "&", 
        "queries": [
          ["[word=\"rood\"]", "[word=\"groen\"]", "[word=\"blauw\"]"]
        ] 
      });
    });

    test("When a query contains multiple OR operators it should return an OR operator and the queries", () => {
      const bracketParserMultipleOr = "[word=\"rood\"]|[word=\"groen\"]|[word=\"blauw\"]";
      expect(queryHandler.bracketParser(bracketParserMultipleOr)).toEqual({ 
        "operator": "|", 
        "queries": [
          ["[word=\"rood\"]", "[word=\"groen\"]", "[word=\"blauw\"]"]
        ] 
      });
    });

    test("When a query starts with a conditional and the conditional is appended with an AND operator to another query, it should return", () => {
      const bracketMixOperatorsWordsLemma = "([word=\"zij\"]|[word=\"wij\"])&[lemma=\"gaan\"]";
      expect(queryHandler.bracketParser(bracketMixOperatorsWordsLemma)).toEqual({ 
        "operator": "&", 
        "queries": [
          { 
            "operator": "|",
            "queries": [
              ["[word=\"zij\"]", "[word=\"wij\"]"]
            ] 
          }, 
          ["[lemma=\"gaan\"]"]
        ] 
      });
    });

    test("When a query contains an AND operator as well as an operator within a (partial) query, it should return the operator and the two parial queries", () => {
      const bracketMixOperatorsLemmaPos = "[lemma=\"eten\"]&[pos=\"N.*,WW.*\"]";
      expect(queryHandler.bracketParser(bracketMixOperatorsLemmaPos)).toEqual({ 
        "operator": "&", 
        "queries": [
          ["[lemma=\"eten\"]", "[pos=\"N.*,WW.*\"]"]
        ] 
      });
    });

  });

});
