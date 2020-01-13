const Sequelize = require('sequelize');
const _ = require('lodash');
const { getWordModel, getFrogModel } = require('../db')

const Op = Sequelize.Op;

let limit = 20;

/**
 * Extracts data from the request object and sends it to the queryHandlerHelper function to retrieve the results.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 * 
 * The @property {Object} query of the @param {Object} req must contain these key-value pairs:
  * @property {String} query The query
  * @property {Object} grades An object containing a grade type as key, and whether or not they should be included in the search as the value (booleans)
  * @property {Object} documents An object containing a document type as key, and whether or not they should be included in the search as the value (booleans)
 * 
 * The @property {Object} params of the @param {Object} req must contain these key-value pairs:
  * @property {Number} offset Number representing how many matches to skip
  * @property {String} corpus The corpus
 */
const queryHandler = async (req, res) => {
  console.log(`API HANDLE QUERY ${req.body.query}`);
  try {
    const { body: { query, grades, documents }, params: { offset, corpus } } = req;

    const result = await queryHandlerHelper(query, grades, documents, corpus, offset);

    res.status(200).send({ result, has_more: result.length >= 20 });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
    return;
  }
}

/**
 * Retrieves the words corresponding the query and splits each word into prewords, targets, and postwords.
 * Combines the lists of prewords, targets, and postwords into one list which will be the final result.
 * Depending on whether the call to this function is an export, the limit is adjusted accordingly.
 * 
 * @param {String} query The query
 * @param {Object} grades An object containing a grade type as key, and whether or not they should be included in the search as the value (booleans)
 * @param {Object} documents An object containing a document type as key, and whether or not they should be included in the search as the value (booleans)
 * @param {String} corpus The corpus
 * @param {Number} offset Number representing how many matches to skip
 * @param {Boolean} isExport A boolean value that indicates if this call is an export
 * @return {Array} A list of objects of the form {preWords, targets, postWords}, where each value is an array of objects. Each object contains information about a word
 */
const queryHandlerHelper = async (query, grades, documents, corpus, offset, isExport = false) => {
  limit = isExport ? 1000 : 20;

  const result = [];

  const partialQueries = partialQueryParser(query);

  const words = await performSearch(partialQueries, grades, documents, offset, corpus);

  for (const word of words) {

    const Word = getWordModel(corpus);

    let wordsInParagraph;
    try {
      wordsInParagraph = await Word.findAll({ where: { paragraph_id: word.paragraph_id }, raw: true });
    } catch (error) {
      console.error(error);
      throw new Error(`ERROR WHILE GETTING WORDS BY PARAGRAPH ID ${error}`);
    }

    const preWords = [];
    const targets = [];
    const postWords = [];

    const sorter = (word1, word2) => {
      if (word1.position_in_paragraph < word2.position_in_paragraph) {
        return -1;
      } else if (word1.position_in_paragraph === word2.position_in_paragraph) {
        return 0;
      } else {
        return 1;
      }
    }

    wordsInParagraph.sort(sorter);

    wordsInParagraph.forEach(pWord => {
      if (pWord.position_in_paragraph < word.position_in_paragraph) {
        preWords.push(pWord);
      } else if (pWord.position_in_paragraph < word.position_in_paragraph + partialQueries.length) {
        targets.push(pWord);
      } else {
        postWords.push(pWord);
      }
    });

    result.push({
      pre_words: preWords,
      targets,
      post_words: postWords
    });
  }

  return result;
}

/**
 * Performs the search by calling the queryMaker to make a sequelized query that can be used to find the matching words.
 * 
 * @param {Array[String]} partialQueries An array of partial query strings
 * @param {Object} grades An object containing a grade type as key, and whether or not they should be included in the search as the value (booleans)
 * @param {Object} documents An object containing a document type as key, and whether or not they should be included in the search as the value (booleans)
 * @param {Number} offset Number representing how many matches to skip
 * @param {String} corpus The corpus
 * @returns {Promise} A promise which, when resolved, returns an array of all words that fit constraints specified by all the parameters
 */
const performSearch = (partialQueries, grades, documents, offset, corpus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = queryMaker(partialQueries, 0, grades, documents, offset, corpus);
      const Word = getWordModel(corpus);
      const words = await Word.findAll(query);

      resolve(words);
    } catch (error) {
      reject(`ERROR IN 'PERFORMSEARCH' ${error}`);
    }
  });
}

/**
 * Parses the full query into partial queries using a regular expression.
 * 
 * @param {String} query 
 * @returns {Array[String]} Partial queries
 */
const partialQueryParser = (query) => {
  const splitRegex = /(?<=\]|\))(?=\[|\()/;
  const partialQueries = query.split(splitRegex);
  return partialQueries;
}

/**
 * Turns its input into a query that can be used by Sequelize.
 * 
 * @param {Array[String]} partialQueries An array of partial query strings
 * @param {Number} index Which index in the partialQueries should be evaluated next
 * @param {Object} grades An object containing a grade type as key, and whether or not they should be included in the search as the value (booleans)
 * @param {Object} documents An object containing a document type as key, and whether or not they should be included in the search as the value (booleans)
 * @param {Number} offset Number representing how many matches to skip
 * @param {String} corpus The corpus
 * @returns {Object} A sequelize query
 */
const queryMaker = (partialQueries, index, grades, documents, offset, corpus) => {
  const partialQuery = partialQueries[index];
  if (index === partialQueries.length) {
    /* The last index of the partial queries, which will be used as an include, but since its empty, that wont do anything. Terminates the recursion */
    return [];
  }
  if (index === 0) {
    /* 
    In the first iteration, specify the limit, offset and the constraints for the first partial query. Join with the Frog table to make sure 
    only the right document and grade types are searched through.
    */
    const gradeTypes = Object.keys(grades).filter(grade => JSON.parse(grades[grade]));
    const documentTypes = Object.keys(documents).filter(document => JSON.parse(documents[document]));
    const Frog = getFrogModel(corpus);
    let includeWhere;
    switch (corpus) {
      case 'basilex':
        includeWhere = {
          grade: gradeTypes,
          document_type: documentTypes
        };
        break;
      case 'basiscript':
        includeWhere = {
          // document types are not relevant for basiscript
          grade: gradeTypes,
        };
        break;
      default: {
        throw new Error(`Invalid corpus ${corpus}`);
      }
    }
    return {
      limit,
      offset,
      where: sequelizePartialQuery(bracketParser(partialQuery)),
      include: [
        {
          model: Frog,
          as: 'frog',
          where: includeWhere
        },
        ...queryMaker(partialQueries, index + 1, grades, documents, offset, corpus)
      ],
    };
  }
  const Word = getWordModel(corpus);
  /* If this index is neither the first or last, it will return an object that can be used in an include field of a Sequelize query */
  return [{
    model: Word,
    as: 'next_word',
    where: sequelizePartialQuery(bracketParser(partialQuery)),
    required: true,
    seperate: true,
    include: queryMaker(partialQueries, index + 1, grades, documents, offset, corpus)
  }];
}

/**
 * Takes an output of the bracketParser and turns it into something that can be used for the 'where' key in a Sequelize query.
 * 
 * @param {Object} query
 * @returns {Object} Sequelize `where` clause
 */
const sequelizePartialQuery = (query) => {
  const { operator, queries } = query;
  if (!operator) {
    /* The deepest nested conditional */
    if (!_.isArray(queries[0])) {
      return sequelizePartialQuery(queries[0]);
    }
    return sequelizeIndividualQuery(queries[0]);
  }
  const subConstraints = [];
  for (const query of queries) {
    if (_.isArray(query)) {
      query.forEach((subQuery) => {
        subConstraints.push(sequelizeIndividualQuery(subQuery));
      });
    } else {
      subConstraints.push(sequelizePartialQuery(query));
    }
  }
  const sequelizeOperator = getSequelizeOperatorFromOperator(operator);
  const constraints = { [sequelizeOperator]: subConstraints };
  return constraints;
}

/**
 * Parses the most primitive form of a query, namely a PARAMETER (word, lemma or pos),
 * followed by the OPERATOR (=, ==, or !=), followed by the possible values.
 * 
 * @param {String} primitiveQuery 
 * @returns {Object} Usable as (part of) a `where` clause in a Sequelize query
 */
const sequelizeIndividualQuery = (primitiveQuery) => {
  const regex = /^\[(word|lemma|pos)(\=\=|\=|\!\=)\"([^\"\]]*)\"\]$/;
  const [, parameter, comparator, values] = regex.exec(primitiveQuery);
  const field = getFieldFromParameter(parameter);
  const sequelizeOperator = getSequelizeOperatorFromOperator(comparator);
  const sequelizedQuery = {
    [field]: { [sequelizeOperator]: values }
  };
  return sequelizedQuery;
}

/**
 * Takes a query and parses the conditional statements in it. The return of this function is an object of the form:
 * {
 *  globalOperator: | OR & OR null (only null if there is only one query inside the array in the queries field)
 *  queries: [
 *    array of Strings and/or Objects
 *    String if: this was de deepest conditional statement in that part of the query
 *    Object if: There are more nested conditionals inside this conditional (this has the same form of the initial return statement, so its recursive)
 *  ]
 * }
 * 
 * @param {String} partialQuery
 * @returns {Object} Parsed conditionals
 */
const bracketParser = (partialQuery) => {
  const queries = [];
  let newQuery = '';
  let globalOperator = null;
  let queryMode = false;
  let index = 0;
  let bracketCounter = 0;

  while (index < partialQuery.length) {
    const currentChar = partialQuery.charAt(index);
    if (currentChar === '|' || currentChar === '&') {
      if (queryMode) {
        newQuery += currentChar;
      } else if (/^[a-z0-9]+/.exec(partialQuery[index + 1])) {
        newQuery += currentChar;
      } else {
        if (globalOperator) {
          if (currentChar !== globalOperator) {
            throw new Error(`CANNOT MIX OPERATORS ${currentChar} ${index}`);
          }
        } else {
          globalOperator = currentChar;
        }
      }
    }
    else if (currentChar === '(') {
      if (queryMode) {
        newQuery += currentChar;
      }
      if (newQuery.length && !queryMode) {
        queries.push(newQuery.split(/(?<=\])(?=\[)/));
        newQuery = '';
      }
      bracketCounter += 1;
      queryMode = true;
    } else if (currentChar === ')' && queryMode) {
      bracketCounter -= 1;
      if (bracketCounter === 0) {
        queries.push(bracketParser(newQuery));
        newQuery = '';
        queryMode = false;
      }
      if (queryMode) {
        newQuery += currentChar;
      }
    } else {
      newQuery += currentChar;
    }
    index += 1;
  }

  if (newQuery.length) {
    queries.push(newQuery.split(/(?<=\])(?=\[)/));
  }
  return { operator: globalOperator, queries };
}

/**
 * Turns a CQL parameter into its respective column in the database model.
 * 
 * @param {String} parameter A CQL parameter
 * @returns {String} Either the name of the column in the database model or it throws an error if the parameter is invalid
 */
const getFieldFromParameter = (parameter) => {
  switch (parameter) {
    case 'word':
      return 'text';
    case 'lemma':
      return 'lemma';
    case 'pos':
      return 'pos';
    default:
      throw new Error(`INVALID PARAMETER: ${parameter}`)
  }
}

/**
 * Turns an CQL operator into its respective Sequelize operator.
 * 
 * @param {String} operator A CQL operator
 * @returns {Object} The corresponding operator which can be used by Sequelize
 */
const getSequelizeOperatorFromOperator = (operator) => {
  switch (operator) {
    case '|':
      return Op.or;
    case '&':
      return Op.and;
    case '=':
      return Op.regexp;
    case '!=':
      return Op.notRegexp;
    case '==':
      return Op.eq;
    default:
      throw new Error(`INVALID OPERATOR: ${operator}`);
  }
}

module.exports = {
  queryHandler,
  queryHandlerHelper,
  partialQueryParser,
  bracketParser,
  sequelizeIndividualQuery,
  sequelizePartialQuery
}