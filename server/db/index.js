const Sequelize = require('sequelize');
let sequelize;

const initialize = () => {
  return new Promise(async (resolve, reject) => {
    sequelize = new Sequelize('basiscript', 'basiscript', '1234', {
      host: 'localhost',
      dialect: 'postgres',
      operatorsAliases: false,
      logging: false,

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    });

    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        reject(`Unable to connect to the database: ${err}`);
      });

    const Basilex_Frog = sequelize.define('basilex_frog', {
      id: { type: Sequelize.UUID, primaryKey: true },
      meta_data: Sequelize.JSONB,
      file_name: Sequelize.STRING,
      grade: Sequelize.STRING,
      document_type: Sequelize.STRING
    }, {
        underscored: true
      }
    );

    const Basiscript_Frog = sequelize.define('basiscript_frog', {
      id: { type: Sequelize.UUID, primaryKey: true },
      meta_data: Sequelize.JSONB,
      file_name: Sequelize.STRING,
      grade: Sequelize.STRING,
      document_type: Sequelize.STRING
    }, {
        underscored: true
      }
    );

    const Basilex_Paragraph = sequelize.define('basilex_paragraph', {
      id: { type: Sequelize.UUID, primaryKey: true },
      position_in_frog: Sequelize.INTEGER,
      text: Sequelize.TEXT,
    }, {
        underscored: true
      }
    );

    const Basiscript_Paragraph = sequelize.define('basiscript_paragraph', {
      id: { type: Sequelize.UUID, primaryKey: true },
      position_in_frog: Sequelize.INTEGER,
      text: Sequelize.TEXT,
    }, {
        underscored: true
      }
    );

    const Basilex_Sentence = sequelize.define('basilex_sentence', {
      id: { type: Sequelize.UUID, primaryKey: true },
      position_in_paragraph: Sequelize.INTEGER,
      text: Sequelize.TEXT,
    }, {
        underscored: true
      }
    );

    const Basiscript_Sentence = sequelize.define('basiscript_sentence', {
      id: { type: Sequelize.UUID, primaryKey: true },
      position_in_paragraph: Sequelize.INTEGER,
      text: Sequelize.TEXT,
    }, {
        underscored: true
      }
    );

    const Basilex_Word = sequelize.define('basilex_word', {
      id: { type: Sequelize.UUID, primaryKey: true },
      text: Sequelize.STRING,
      length: Sequelize.INTEGER,
      lemma: Sequelize.STRING,
      morphology: Sequelize.ARRAY(Sequelize.TEXT),
      pos: Sequelize.STRING,
      position_in_sentence: Sequelize.INTEGER,
      position_in_paragraph: Sequelize.INTEGER
    }, {
        underscored: true
      }
    );

    const Basiscript_Word = sequelize.define('basiscript_word', {
      id: { type: Sequelize.UUID, primaryKey: true },
      text: Sequelize.STRING,
      length: Sequelize.INTEGER,
      lemma: Sequelize.STRING,
      morphology: Sequelize.ARRAY(Sequelize.TEXT),
      pos: Sequelize.STRING,
      position_in_sentence: Sequelize.INTEGER,
      position_in_paragraph: Sequelize.INTEGER
    }, {
        underscored: true
      }
    );

    const Basilex_Lemma_Frequency = sequelize.define('basilex_lemma_frequency', {
      id: { type: Sequelize.UUID, primaryKey: true },
      word: Sequelize.STRING,
      lemma: Sequelize.STRING,
      pos: Sequelize.STRING,
      total_frequency: Sequelize.INTEGER,
      group_0: Sequelize.INTEGER,
      group_1: Sequelize.INTEGER,
      group_2: Sequelize.INTEGER,
      group_3: Sequelize.INTEGER,
      group_4: Sequelize.INTEGER,
      group_5: Sequelize.INTEGER,
      group_6: Sequelize.INTEGER,
      group_7: Sequelize.INTEGER,
      group_8: Sequelize.INTEGER,
      VO_1: Sequelize.INTEGER,
      VO_2: Sequelize.INTEGER,
    }, {
        underscored: true
      }
    );

    const Basiscript_Lemma_Frequency = sequelize.define('basiscript_lemma_frequency', {
      id: { type: Sequelize.UUID, primaryKey: true },
      word: Sequelize.STRING,
      lemma: Sequelize.STRING,
      pos: Sequelize.STRING,
      total_frequency: Sequelize.INTEGER,
      group_0: Sequelize.INTEGER,
      group_1: Sequelize.INTEGER,
      group_2: Sequelize.INTEGER,
      group_3: Sequelize.INTEGER,
      group_4: Sequelize.INTEGER,
      group_5: Sequelize.INTEGER,
      group_6: Sequelize.INTEGER,
      group_7: Sequelize.INTEGER,
      group_8: Sequelize.INTEGER,
      VO_1: Sequelize.INTEGER,
      VO_2: Sequelize.INTEGER,
    }, {
        underscored: true
      }
    );

    const User = sequelize.define('user', {
      id: { type: Sequelize.UUID, primaryKey: true },
      username: Sequelize.STRING,
      password: Sequelize.STRING
    });

    Basilex_Paragraph.belongsTo(Basilex_Frog, { as: 'frog' });
    Basilex_Sentence.belongsTo(Basilex_Paragraph, { as: 'paragraph' });
    Basilex_Sentence.belongsTo(Basilex_Frog, { as: 'frog' });
    Basilex_Word.belongsTo(Basilex_Sentence, { as: 'sentence' });
    Basilex_Word.belongsTo(Basilex_Paragraph, { as: 'paragraph' });
    Basilex_Word.belongsTo(Basilex_Frog, { as: 'frog' });
    Basilex_Word.belongsTo(Basilex_Word, { as: 'previous_word', allowNull: true, onDelete: 'CASCADE' });
    Basilex_Word.belongsTo(Basilex_Word, { as: 'next_word', allowNull: true, onDelete: 'CASCADE' });

    Basiscript_Paragraph.belongsTo(Basiscript_Frog, { as: 'frog' });
    Basiscript_Sentence.belongsTo(Basiscript_Paragraph, { as: 'paragraph' });
    Basiscript_Sentence.belongsTo(Basiscript_Frog, { as: 'frog' });
    Basiscript_Word.belongsTo(Basiscript_Sentence, { as: 'sentence' });
    Basiscript_Word.belongsTo(Basiscript_Paragraph, { as: 'paragraph' });
    Basiscript_Word.belongsTo(Basiscript_Frog, { as: 'frog' });
    Basiscript_Word.belongsTo(Basiscript_Word, { as: 'previous_word', allowNull: true, onDelete: 'CASCADE' });
    Basiscript_Word.belongsTo(Basiscript_Word, { as: 'next_word', allowNull: true, onDelete: 'CASCADE' });

    try {
      await sequelize.sync({});
      resolve();
    } catch (error) {
      console.error(`ERROR WHILE SYNCING DATABASE ${error}`);
      reject(`ERROR WHILE SYNCING DATABASE ${error}`);
    }
  });
}

const getParagraphModel = (corpus) => {
  const { basilex_paragraph, basiscript_paragraph } = sequelize.models;
  switch (corpus) {
    case 'basilex':
      return basilex_paragraph;
    case 'basiscript':
      return basiscript_paragraph;
    default:
      throw new Error(`Trying to get paragraph model for non-existing corpus '${corpus}'`);
  }
}

const getSentenceModel = (corpus) => {
  const { basilex_sentence, basiscript_sentence } = sequelize.models;
  switch (corpus) {
    case 'basilex':
      return basilex_sentence;
    case 'basiscript':
      return basiscript_sentence;
    default:
      throw new Error(`Trying to get sentence model for non-existing corpus '${corpus}'`);
  }
}

const getWordModel = (corpus) => {
  const { basilex_word, basiscript_word } = sequelize.models;
  switch (corpus) {
    case 'basilex':
      return basilex_word;
    case 'basiscript':
      return basiscript_word;
    default:
      throw new Error(`Trying to get word model for non-existing corpus '${corpus}'`);
  }
}

const getFrogModel = (corpus) => {
  const { basilex_frog, basiscript_frog } = sequelize.models;
  switch (corpus) {
    case 'basilex':
      return basilex_frog;
    case 'basiscript':
      return basiscript_frog;
    default:
      throw new Error(`Trying to get frog model for non-existing corpus '${corpus}'`);
  }
}

const getLemmaFrequencyModel = (corpus) => {
  const { basilex_lemma_frequency, basiscript_lemma_frequency } = sequelize.models;
  switch (corpus) {
    case 'basilex':
      return basilex_lemma_frequency;
    case 'basiscript':
      return basiscript_lemma_frequency;
    default:
      throw new Error(`Trying to get lemma frequency model for non-existing corpus '${corpus}'`);
  }
}

const getUserModel = () => {
  const { user } = sequelize.models;
  return user;
}

const getConnection = () => {
  return sequelize;
}

module.exports = {
  initialize,
  getConnection,
  getParagraphModel,
  getSentenceModel,
  getWordModel,
  getFrogModel,
  getLemmaFrequencyModel,
  getUserModel
};