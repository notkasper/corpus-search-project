const { getFrogModel } = require('../db')

/**
 * Extracts frog id and corpus from the request. 
 * Retrieves the frog model corresponding to the corpus, 
 * and finds the frog data in the frog model corresponding to the frog id.
 * 
 * @param {Object} req An express requester object
 * @param {Object} res An express response object
 */
module.exports = async (req, res) => {
  console.log('API GET FROG DATA BY ID');
  const { id, corpus } = req.params;
  const Frog = getFrogModel(corpus);
  try {
    const frogData = await Frog.findOne({ where: { id } })
    res.status(200).send({ result: frogData });
  } catch (error) {
    res.status(400).send({ error });
  }
}