import { observable, action } from 'mobx';

class ApplicationStore {
  @observable isLoading = false;
  @observable currentPage = '';
  @observable currentPage = 'Home';
  @observable basiscript = false; 

  @action switchDatabase = () => { this.basiscript = !this.basiscript }

  @action loading = () => this.isLoading = true;

  @action doneLoading = () => this.isLoading = false;

  @action setCurrentPage = (page) => this.currentPage = page;

  @action getCorpus = () => this.basiscript ? 'basiscript' : 'basilex';
}

const applicationStore = window.applicationStore = new ApplicationStore();

export default applicationStore;
