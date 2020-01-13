import { observable, action } from 'mobx';

class TabStore {
  @observable basilexTabs = observable.array([]);
  @observable basiscriptTabs = observable.array([]);
  @observable tabIndex = 0;
  @observable currentTabData = null;

  @action reset = () => {
    this.basilexTabs = observable.array([]);
    this.basiscriptTabs = observable.array([]);
    this.tabIndex = 0;
  }

  @action setCurrentTabData = (tabData) => this.currentTabData = tabData;

  @action getCurrentTabData = () => this.currentTabData;

  @action addBasilexTab = (newTab) => this.basilexTabs.push(newTab);

  @action addBasiscriptTab = (newTab) => this.basiscriptTabs.push(newTab);

  @action removeTabById = (id) => {
    let nextTabIndex = null;
    this.basilexTabs = this.basilexTabs.filter((tab, index) => {
      if (id === tab.id) {
        nextTabIndex = index - 1;
        return false;
      }
      return true;
    });
    this.basiscriptTabs = this.basiscriptTabs.filter((tab, index) => {
      if (id === tab.id) {
        nextTabIndex = index - 1;
        return false;
      }
      return true;
    });
    return nextTabIndex;
  }

}

const tabStore = window.tabStore = new TabStore();

export default tabStore;
