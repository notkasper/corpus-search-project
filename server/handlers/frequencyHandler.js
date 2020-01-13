const { Op } = require('sequelize');
const { getLemmaFrequencyModel } = require('../db');

let limit = 20;
const PoS = ['ADJ', 'BW', 'LID', 'N', 'SPEC', 'TSW', 'TW', 'VG', 'VNW', 'VZ', 'WW'];

/**
 * Extract data from the request object and sends it to the frequencyHandlerHelper function to retrieve the results.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 */
const frequencyHandler = async (req, res) => {
  console.log('API GET FREQUENCY');
  const { query: { queries, strict, searchMode }, params: { corpus, offset } } = req;
  let result;
  try {
    result = await frequencyHandlerHelper(queries, strict, searchMode, corpus, offset)
  } catch (error) {
    console.error(`ERROR WHILE GETTING FREQUENCIES ${error}`);
    res.status(400).send({ error: `ERROR WHILE GETTING FREQUENCIES ${error}` });
    return;
  }
  res.status(200).send({ result, has_more: result.length >= 20 });
}

/**
 * Retrieves the frequency model corresponding to the corpus and creates a sequelized query.
 * Searches the frequency model using the sequelized query to find matching results.
 * Depending on whether the call to this function is an export, the limit is adjusted accordingly.
 * 
 * @param {Array[String]} queries A list of queries
 * @param {Boolean} strict A boolean value that indicates if strict mode was selected
 * @param {String} searchMode A string that indicates the search mode that was used (either 'word' or 'lemma')
 * @param {String} corpus The corpus
 * @param {Number} offset Number representing how many matches to skip
 * @param {Boolean} isExport A boolean value that indicates if this call is an export
 * @returns {Array} A list of objects that match the query
 */
const frequencyHandlerHelper = async (queries, strict, searchMode, corpus, offset, isExport = false) => {
  limit = isExport ? 1000 : 20;
  const Frequency = getLemmaFrequencyModel(corpus);
  let result;
  try {
    const sequelizedQuery = sequelizeQuery(JSON.parse(queries), strict === 'true', searchMode);
    result = await Frequency.findAll({ limit, offset, where: sequelizedQuery });
  } catch (error) {
    console.error(error);
    throw new Error(`ERROR WHILE GETTING FREQUENCIES ${error}`);
  }
  return result;
}

/**
 * Convert the queries list to one sequelized query while taking strict and search mode into consideration.
 * 
 * @param {Array[String]} queries A list of queries
 * @param {Boolean} strict A boolean value that indicates if strict mode was selected
 * @param {String} searchMode A string that indicates the search mode that was used (either 'word' or 'lemma')
 * @returns {Object} A sequelized query
 */
const sequelizeQuery = (queries, strict, searchMode) => {
  const queryObjects = [];
  queries.forEach(term => {
    const trimmedTerm = term.trim();
    let queryObject = (PoS.indexOf(trimmedTerm) > -1) ? { pos: trimmedTerm } : { [`${searchMode}`]: trimmedTerm };
    if (term.includes('|')) {
      const [antecedent, sensitivePos] = trimmedTerm.split('|');
      pos = sensitivePos.toUpperCase();
      queryObject = { [`${searchMode}`]: antecedent, pos };
    }
    if (!strict) {
      queryObject[`${searchMode}`] = { [Op.like]: `%${queryObject[`${searchMode}`]}%` };
    }
    queryObjects.push(queryObject);
  });
  const sequelizedQuery = { [Op.or]: queryObjects };
  return sequelizedQuery;
}

module.exports = {
  frequencyHandler,
  frequencyHandlerHelper
}