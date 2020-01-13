const _ = require('lodash');
const { queryHandlerHelper } = require('./queryHandler')

/**
 * Writes a CSV encoded string using the data and metadata. 
 * Headers are added as well and the data is formatted before being added to the CSV encoded string.
 * @param {Object} data An object containing prewords, targets, and postwords
 * @param {String} metadata A string containing the metadata of the query
 * @returns {String} CSV encoded string of the metadata and data
 */
const writeCSV = (data, metadata) => {
  const csvContent = [];
  const headers = "ID, PREWORD, TARGETWORD, POSTWORD"
  csvContent.push(metadata, headers);
  // sentences with ';' are displayed incorrectly
  // for some reason it splits it on ';' even with enclosing double quotes
  data.map((dataPoint, id) => {
    const preWord = dataPoint.preWords.map(word => _.get(word, 'text', ''))
      .join(" ")
      .replace(/\s[^\w\u2013\u2014]/g, (punctuation) => punctuation.trim()) // \u2013: en dash, \u2014: em dash
      .replace(/\"/g, '""');
    const targetWord = dataPoint.targets.map(word => _.get(word, 'text', '')).join(" ");
    const postWord = dataPoint.postWords.map(word => _.get(word, 'text', ''))
      .join(" ")
      .replace(/\s[^\w\u2013\u2014]/g, (punctuation) => punctuation.trim()) // \u2013: en dash, \u2014: em dash
      .replace(/\"/g, '""');
    const row = [
      id + 1, '\"' + preWord + '\"', '\"' + targetWord + '\"', '\"' + postWord + '\"'
    ];
    csvContent.push(row);
  });
  const csvContentJoined = csvContent.join("\n")
  const csv = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContentJoined);
  return csv;
};

/**
 * Converts the filters object into an array containing only the key if the value of that key is 'true'.
 * 
 * @param {Object} filters An object with the filter name as the key and a boolean (string) value
 * @returns {Array} A list of filter keys
 */
const writeCSVFilters = (filters) => {
  let csvFilters = [];
  Object.keys(filters).forEach(key => {
    (filters[key] === 'true') && csvFilters.push(key);
  });
  return csvFilters;
}

/**
 * Extracts data from request object to be used for the export and constructs metadata using the extracted data. 
 * Calls the queryHandlerHelper with the parameter `isExport` set to `true` to indicate that this is an export.
 * The results from the queryHandlerHelper together with the metadata are converted to a CSV string and sent back to the client.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 */
module.exports = async (req, res) => {
  console.log('API HANDLE EXPORT')
  const { query: { query, grades, documents, context }, params: { corpus } } = req;
  const _documents = documents || {}; // handling undefined
  const csvQuery = query.replace(/"/g, '""');
  const csvGrades = JSON.stringify(writeCSVFilters(grades)).replace(/,/g, ';').replace(/"/g, '');
  const csvDocuments = JSON.stringify(writeCSVFilters(_documents)).replace(/,/g, ';').replace(/"/g, '');
  const partialMetadata = `\"<metadata> corpus=${corpus} CQL_query=${csvQuery} grade_filter=${csvGrades} `;
  const metadata = (corpus === 'basilex') ? partialMetadata + `document_filter=${csvDocuments} </metadata>\"` : partialMetadata + '</metadata>\"';
  try {
    const result = await queryHandlerHelper(query, grades, _documents, corpus, 0, true);
    const data = result.map(({ pre_words, targets, post_words }) => {
      return {
        preWords: pre_words.slice(-context),
        targets,
        postWords: post_words.slice(0, context)
      };
    });
    const csv = writeCSV(data, metadata);
    res.status(200).send({ export: csv });
  } catch (error) {
    console.log(`ERROR DURING EXPORT: ${error}`);
    res.status(500).send({ error });
  }
}