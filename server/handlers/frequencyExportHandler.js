const { frequencyHandlerHelper } = require('./frequencyHandler')

/**
 * Writes a CSV encoded string using the data. 
 * Initially it extracts the keys from a single object in the list once to generate the headers.
 * 
 * @param {Array} data A list of objects that contain information about individual results
 * @returns {String} CSV encoded string of the data
 */
const writeCSV = (data) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  const columns = Object.keys(data[0].dataValues);
  csvContent += columns.join(',') + "\r\n";
  data.forEach(dataPoint => {
    const content = [];
    Object.keys(dataPoint.dataValues).forEach(key => content.push(dataPoint[key]));
    csvContent += content.join(',') + "\r\n";
  });
  return csvContent;
}

/**
 * Extracts data from request object to be used for the export.
 * Calls the frequencyHandlerHelper with the parameter `isExport` set to `true` to indicate that this is an export.
 * The results from the frequencyHandlerHelper are converted to a CSV string and sent back to the client.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 */
module.exports = async (req, res) => {
  console.log('API HANDLE FREQUENCY EXPORT')
  const { query: { queries, strict, searchMode }, params: { corpus } } = req;
  try {
    const data = await frequencyHandlerHelper(queries, strict, searchMode, corpus, 0, true);
    const csv = writeCSV(data);
    res.status(200).send({ export: csv });
  } catch (error) {
    console.log(`ERROR DURING EXPORT: ${error}`);
    res.status(500).send({ error });
  }
}