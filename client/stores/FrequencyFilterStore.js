import { observable, action } from 'mobx';

class FrequencyFilterStore {
  @observable grades = {
    'group_0': false,
    'group_1': false,
    'group_2': false,
    'group_3': false,
    'group_3': false,
    'group_4': false,
    'group_5': false,
    'group_6': false,
    'group_7': false,
    'group_8': false,
    'VO_1': false,
    'VO_2': false,
  };

  @action reset = () => {
    this.handleClear();
  }

  @action handleChange = name => event => {
    this.grades[name] = event.target.checked
  };

  @action handleSelectAll = () => {
    Object.keys(this.grades).forEach(key => {
      this.grades[key] = true;
    });
  };

  @action handleClear = () => {
    Object.keys(this.grades).forEach(key => {
      this.grades[key] = false;
    });
  };

}

const frequencyFilterStore = window.frequencyFilterStore = new FrequencyFilterStore();

export default frequencyFilterStore;