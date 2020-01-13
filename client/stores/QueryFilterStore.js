import { observable, action, computed } from 'mobx';
import applicationStore from './ApplicationStore';

class QueryFilterStore {
  @observable showFilter = false;

  @observable basilexGrades = {
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false,
    '1VO': false,
    '2VO': false,
  };

  @observable basiscriptGrades = {
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false,
    '1VO': false,
    '2VO': false,
  };

  @observable basilexDocuments = {
    ondertitels: false,
    leesboek: false,
    zaakvakmethode: false,
    newsfeed: false,
    toets: false,
    strip: false,
    rekenmethode: false,
    taalmethode: false,
  };

  @action reset = () => {
    this.showFilter = false;
    this.handleClear();
  }

  @computed get grades()  {
    return applicationStore.basiscript ? this.basiscriptGrades : this.basilexGrades;
  };

  @computed get documents() {
    return applicationStore.basiscript ? {} : this.basilexDocuments;
  };

  @action swapFilter = () => { this.showFilter = !this.showFilter };

  @action disableFilter = () => { this.showFilter = false };

  @action handleChange = name => event => {
    this.grades.hasOwnProperty(name) ?
      this.grades[name] = event.target.checked
      :
      this.documents[name] = event.target.checked
  };

  @action handleSelectAll = () => {
    Object.keys(this.grades).forEach(key => {
      this.grades[key] = true;
    });
    Object.keys(this.documents).forEach(key => {
      this.documents[key] = true;
    });
  };

  @action handleClear = () => {
    Object.keys(this.grades).forEach(key => {
      this.grades[key] = false;
    });
    Object.keys(this.documents).forEach(key => {
      this.documents[key] = false;
    });
  };

}

const queryFilterStore = window.queryFilterStore = new QueryFilterStore();

export default queryFilterStore;