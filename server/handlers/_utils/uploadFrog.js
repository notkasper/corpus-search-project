const dom = require('xmldom').DOMParser;
const xpath = require('xpath');
const _ = require('lodash');
const uuid = require('uuid');
const { getSentenceModel, getWordModel, getParagraphModel, getFrogModel } = require('../../db');

// TODO:
// Decide how we are going to handle uploaded files

/**
 * Uploads a Frog file from a specific corpus.
 * 
 * @param {String} file Path to file
 * @param {String} fileName The name of the file
 * @param {String} corpus The corpus
 * @returns {Promise} A promise which, when resolved, returns a message that indicates the upload was successful
 */
module.exports = (file, fileName, corpus) => {
  return new Promise(async (resolve, reject) => {
    console.log('UPLOADING FROG');
    try {

      const xml = new dom().parseFromString(file);
      const select = xpath.useNamespaces({ fml: 'http://ilk.uvt.nl/folia' }) // necessary because the xml uses the FoLiA namespaces

      // xpath queries from the official FoLiA documentation which can be found online
      const metaTagIds = select('/fml:FoLiA/fml:metadata/fml:meta/@id', xml);
      const metaData = {};
      metaTagIds.forEach((metaTagId, index) => {
        const id = metaTagId.nodeValue;
        const value = _.get(select(`/fml:FoLiA/fml:metadata/fml:meta[@id='${id}']/text()`, xml)[0], 'nodeValue', 'no_data');
        metaData[id] = value;
      });
      const { grade, type } = metaData;
      const frogId = uuid.v4();
      const Frog = getFrogModel(corpus);
      await Frog.create({
        id: frogId,
        file_name: fileName,
        grade,
        document_type: type,
        meta_data: metaData
      });
      const paragraphs = select('//fml:p[not(ancestor-or-self::*/@auth)]', xml);
      let paragraphCounter = 0;
      for (const paragraph of paragraphs) {
        const paragraphId = uuid.v4();
        const paragraphTextNode = select('fml:t/text()', paragraph);
        const paragraphTextValue = _.get(paragraphTextNode, '[0].nodeValue', 'no_data');
        const Paragraph = getParagraphModel(corpus);
        await Paragraph.create({
          id: paragraphId,
          position_in_frog: paragraphCounter,
          text: paragraphTextValue,
          frog_id: frogId
        })
        const sentences = select('fml:s', paragraph);
        let sentenceCounter = 0;
        let wordPositionInParagraph = 0;
        for (const sentence of sentences) {
          const sentenceId = uuid.v4();
          const sentenceTextNode = select('fml:t/text()', sentence);
          const sentenceTextValue = _.get(sentenceTextNode, '[0].nodeValue', 'no_data');
          const Sentence = getSentenceModel(corpus);
          await Sentence.create({
            id: sentenceId,
            paragraph_id: paragraphId,
            position_in_paragraph: sentenceCounter,
            text: sentenceTextValue,
            frog_id: frogId
          })
          const wordTags = select('fml:w', sentence);
          const words = [];
          wordTags.forEach((wordTag, index) => {
            const textNode = select('fml:t/text()', wordTag);
            const textValue = _.get(textNode, '[0].nodeValue', 'no_data');
            const lemmaNode = select('fml:lemma/@class', wordTag);
            const lemmaValue = _.get(lemmaNode, '[0].nodeValue', 'no_data');
            const posNode = select('fml:pos/@class', wordTag);
            const posValue = _.get(posNode, '[0].nodeValue', 'no_data');
            const morphemeNodes = select('fml:morphology/fml:morpheme/fml:t/text()', wordTag);
            const morphemes = []
            morphemeNodes.forEach(morphemeNode => {
              const morphemeValue = _.get(morphemeNode, 'nodeValue', 'no_data');
              morphemes.push(morphemeValue)
            });
            const positionInSentence = index;
            const length = textValue.length;
            const wordId = uuid.v4();
            words.push({
              id: wordId,
              text: textValue,
              pos: posValue,
              length,
              lemma: lemmaValue,
              sentence_id: sentenceId,
              paragraph_id: paragraphId,
              position_in_sentence: positionInSentence,
              position_in_paragraph: wordPositionInParagraph,
              frog_id: frogId,
              morphology: morphemes
            })
            wordPositionInParagraph += 1;
          });
          let previousWordReference = null;
          const Word = getWordModel(corpus);
          for (const word of words) {
            const newWord = await Word.create({ ...word, previous_word_id: previousWordReference ? previousWordReference.dataValues.id : null });
            if (previousWordReference) {
              await previousWordReference.update({ next_word_id: newWord.dataValues.id });
            }
            previousWordReference = newWord;
          }
          sentenceCounter += 1;
        }
        paragraphCounter += 1;
      }
      resolve('yay');
    } catch (error) {
      console.error(`ERROR WHILE UPLOADING FROG ${error}`);
      reject(`ERROR WHILE UPLOADING FROG ${error}`);
    }
  });
}