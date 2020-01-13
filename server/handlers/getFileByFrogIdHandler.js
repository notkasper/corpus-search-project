const { getFrogModel } = require('../db');
const path = require('path');

/**
 * Extracts frog id and corpus from request to find the frog file corresponding to the id in given corpus,
 * and then downloads it to the client.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 */
module.exports = async (req, res) => {
  console.log('API GET FROG ID');
  const { id, corpus } = req.params;
  const frog = getFrogModel(corpus);
  try {
    const { dataValues: { file_name: fileName } } = await frog.findOne({ where: { id }, attributes: ['file_name'] });
    res.status(200).download(path.join(__dirname, `../resources/${corpus === 'basilex' ? 'basilex_small' : 'basiscript_small'}`, fileName), `${fileName}.xml`);
  } catch (error) {
    console.error(`ERROR WHILE SENDING FILE IN RESPONSE ${error}`);
    res.status(400).send({ error });
  }
}
