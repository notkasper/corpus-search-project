import { configure, shallow } from 'enzyme';
import SimpleQueryForm from '../sub_components/SimpleQueryForm';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import queryStore from '../../stores/QueryStore';
import queryFilterStore from '../../stores/QueryFilterStore';
import applicationStore from '../../stores/ApplicationStore';
import themeStore from '../../stores/ThemeStore';
import { observable, action } from 'mobx';

const QueryStoreClass = require("../../stores/QueryStore");
const queryStoreClass = QueryStoreClass.default;

configure({ adapter: new Adapter() });
const store = {
  queryFilterStore,
  queryStore,
  applicationStore,
  themeStore
}
const wrapper = shallow(<SimpleQueryForm queryFilterStore={queryFilterStore} queryStore={queryStore} applicationStore={applicationStore} themeStore={themeStore} />);
const instance = wrapper.dive().dive().instance();//two dives because Home is exported withStyles...
const parseQueryRunner = (word,lemma,pos) => {
  //change state 
  instance.setState({
    word: word,
    lemma: lemma,
    pos: pos});
  //call the parseQuery method which changes the query in the QueryStore 
  instance.parseQuery(); 

}



describe("Simple query parser tests", () => {

  const word = "rood";
  const words = "rood,blauw";
  const empty = "";
  const lemma = "lopen";
  const lemmas = "lopen,rennen";
  const pos = "WW";
  const twoPos = "WW,NW";

  //const query = word,lemma,pos;
  const queryParsedWord = "([word==\"rood\"]&[lemma=\"\"]&[pos=\"\"])";
  const queryParsedWords = "([word==\"rood|blauw\"]&[lemma=\"\"]&[pos=\"\"])"
  const queryParsedLemma = "([word=\"\"]&[lemma==\"lopen\"]&[pos=\"\"])";
  const queryParsedLemmas = "([word=\"\"]&[lemma==\"lopen|rennen\"]&[pos=\"\"])";
  const queryParsedPos = "([word=\"\"]&[lemma=\"\"]&[pos=\"WW\"])";
  const queryParsedTwoPos = "([word=\"\"]&[lemma=\"\"]&[pos=\"WW|NW\"])";

  const queryParsedWordPos = "([word==\"rood\"]&[lemma=\"\"]&[pos=\"WW\"])";
  const queryParsedLemmaPos = "([word=\"\"]&[lemma==\"lopen\"]&[pos=\"WW\"])";
  const queryParsedLemmasTwoPos = "([word=\"\"]&[lemma==\"lopen|rennen\"]&[pos=\"WW|NW\"])";
  const queryParsedWordsTwoPos = "([word==\"rood|blauw\"]&[lemma=\"\"]&[pos=\"WW|NW\"])";

  describe("Tests for words,lemmas and pos but not combined ", () => {

    test("Simple query of one word should return CQL query of that word", () => {
      parseQueryRunner(word,empty,empty);
      
      //check whether the query is correct
      expect(queryStoreClass.query).toEqual(queryParsedWord);
    });

    test("Simple query consisting of multiple words should return the CQL query with those words", () => {
      parseQueryRunner(words,empty,empty);

      expect(queryStoreClass.query).toEqual(queryParsedWords);
    });

    test("Simple query consisting of one lemma should return the CQL query of that lemma", () => {
      parseQueryRunner(empty,lemma,empty);

      expect(queryStoreClass.query).toEqual(queryParsedLemma);
    });

    test("Simple query consisting of two lemmas should return the CQL query of those lemmas", () => {
      parseQueryRunner(empty,lemmas,empty);
      expect(queryStoreClass.query).toEqual(queryParsedLemmas);
    });

    test("Simple query consisting of one PoS should return the CQL query of that PoS", () => {
      parseQueryRunner(empty,empty,pos);
      expect(queryStoreClass.query).toEqual(queryParsedPos);
    });

    test("Simple query consisting of one PoS should return the CQL query of that PoS", () => {
      parseQueryRunner(empty,empty,twoPos);
      expect(queryStoreClass.query).toEqual(queryParsedTwoPos);

    });

  });
  //word and pos
  describe("Tests for words,lemmas and pos combinations ", () => {

    test("Simple query consisting of one word and PoS should return the CQL query of that word and PoS", () => {
      parseQueryRunner(word,empty,pos);
      expect(queryStoreClass.query).toMatch(queryParsedWordPos);
    });

    test("Simple query consisting of two words and two PoS should return the CQL query of those words and PoS's", () => {
      parseQueryRunner(words,empty,twoPos);
      expect(queryStoreClass.query).toMatch(queryParsedWordsTwoPos);
    });

    test("Simple query consisting of one lemma and  PoS should return the CQL query of that lemma and PoS", () => {
      parseQueryRunner(empty,lemma,pos);
      expect(queryStoreClass.query).toMatch(queryParsedLemmaPos);
    });

    test("Simple query consisting of two lemmas and  PoS's should return the CQL query of those lemmas and PoS's", () => {
      parseQueryRunner(empty,lemmas,twoPos);
      expect(queryStoreClass.query).toMatch(queryParsedLemmasTwoPos);
    });
  });

  //weird and faulty queries..
  
});
