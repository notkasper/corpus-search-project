const uuid = require('uuid');
const db = require('../db');

const convertGrade = (grade) => {
  switch (grade) {
    case '0':
      return 'group_0';
    case '1':
      return 'group_1';
    case '2':
      return 'group_2';
    case '3':
      return 'group_3';
    case '4':
      return 'group_4';
    case '5':
      return 'group_5';
    case '6':
      return 'group_6';
    case '7':
      return 'group_7';
    case '8':
      return 'group_8';
    case '9':
      return 'VO_1';
    default:
      throw new Error(`Tried to convert invalid grade: ${grade}`);
  }
}

const convertPos = (pos) => {
  if (pos.startsWith('ADJ')) {
    return 'ADJ';
  } else if (pos.startsWith('N')) {
    return 'N';
  } else if (pos.startsWith('VG')) {
    return 'VG';
  } else if (pos.startsWith('VZ')) {
    return 'VZ';
  } else if (pos.startsWith('WW')) {
    return 'WW';
  } else if (pos.startsWith('VWN')) {
    return 'VNW';
  } else if (pos.startsWith('SPEC')) {
    return 'SPEC';
  } else if (pos.startsWith('BW')) {
    return 'BW';
  } else if (pos.startsWith('VNW')) {
    return 'VNW';
  } else if (pos.startsWith('TW')) {
    return 'TW';
  } else if (pos.startsWith('LET')) {
    return 'LET';
  } else if (pos.startsWith('LID')) {
    return 'LID';
  } else if (pos.startsWith('TSW')) {
    return 'TSW';
  } else {
    throw new Error(`Tried to convert invalid PoS: ${pos}`);
  }
}

const corpus = 'basiscript';

(
  async () => {
    try {
      await db.initialize();
      const Word = db.getWordModel(corpus);
      const Frog = db.getFrogModel(corpus);
      const Frequency = db.getLemmaFrequencyModel(corpus);
      // Clear table
      await Frequency.destroy({ where: {} });
      // Fill table
      const words = await Word.findAll({});
      let counter = 0;
      for (const word of words) {
        const { text, lemma } = word;
        let pos;
        try {
          pos = convertPos(word.pos);
        } catch (error) {
          console.error(error);
          continue;
        }
        let existingWord = await Frequency.findOne({
          where: {
            word: text,
            lemma: lemma,
            pos: pos
          }
        });
        if (!existingWord) {
          // add it to the table
          existingWord = await Frequency.create({
            id: uuid.v4(),
            word: text,
            lemma: lemma,
            pos: pos,
            total_frequency: 0,
            group_0: 0,
            group_1: 0,
            group_2: 0,
            group_3: 0,
            group_4: 0,
            group_5: 0,
            group_6: 0,
            group_7: 0,
            group_8: 0,
            VO_1: 0,
            VO_2: 0
          });
        }
        // increment it
        const frog = await Frog.findOne({ where: { id: word.frog_id } });
        let grade;
        try {
          grade = convertGrade(frog.grade);
        } catch (error) {
          console.error(error);
          continue;
        }
        existingWord[grade] += 1;
        existingWord['total_frequency'] += 1;
        await existingWord.save();
        counter += 1;
        if (counter % 100 === 0) {
          console.log(`${Math.round(counter / words.length * 100 * 100) / 100}%`);
        }
      }
    } catch (error) {
      console.error(`ERROR WHILE GENERATING FREQUENCIES FOR BASILEX ${error}`);
    } finally {
      db.getConnection().close();
    }
  }
)();