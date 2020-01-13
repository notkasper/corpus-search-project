const fs = require('fs');
const path = require('path');
const uploadFrog = require('../handlers/_utils/uploadFrog');
const db = require('../db');

const relativePathToFrogFiles = '../resources/basilex_small';

const dbName = 'basilex';

(
  () => {
    return new Promise(async (resolve, reject) => {
      try {
        await db.initialize();
        // clear tables
        const Frog = db.getFrogModel(dbName);
        const Paragraph = db.getParagraphModel(dbName);
        const Sentence = db.getSentenceModel(dbName);
        const Word = db.getWordModel(dbName);
        await Frog.destroy({ where: {} });
        await Paragraph.destroy({ where: {} });
        await Sentence.destroy({ where: {} });
        await Word.destroy({ where: {} });
        // fill tables
        const fileNames = fs.readdirSync(path.join(__dirname, relativePathToFrogFiles));
        let counter = 0;
        for (const fileName of fileNames) {
          const pathToFile = path.join(__dirname, relativePathToFrogFiles, fileName);
          const file = fs.readFileSync(pathToFile, 'utf8');
          await uploadFrog(file, fileName, dbName);
          counter += 1;
          console.log(`FILE ${counter} OF ${fileNames.length} NAMED ${fileName} HAS BEEN UPLOADED!`);
        }
        console.log(`${dbName} tables seeded successfully`);
        resolve();
      } catch (error) {
        console.error(`ERROR WHILE SEEDING ${dbName.toUpperCase()} ${error}`);
        reject(`ERROR WHILE SEEDING ${dbName.toUpperCase()} ${error}`);
      } finally {
        db.getConnection().close();
      }
    });
  }
)();