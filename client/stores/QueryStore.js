import request from 'superagent';
import { observable, action } from 'mobx';
import queryFilterStore from './QueryFilterStore';
import errorStore from './ErrorStore';
import Cookies from 'js-cookie';
import applicationStore from './ApplicationStore';

class QueryStore {
  @observable query = '';
  @observable queryData = observable.array([]);
  @observable hasMore = false;
  @observable CQLMode = true;
  @observable amountOfContext = 3;
  @observable strictMode = true;
  @observable currentActiveQuery = '';

  @action reset = () => {
    this.query = '';
    this.queryData = observable.array([]);
    this.hasMore = false;
    this.CQLMode = true;
    this.amountOfContext = 3;
    this.strictMode = true;
  }

  @action setQuery = (query) => this.query = query;

  @action setWordField = (input) => this.wordField = input;

  @action setLemmaField = (input) => this.lemmaField = input;

  @action setPosField = (input) => this.posField = input;

  @action setAmountOfContext = (amountOfContext) => this.amountOfContext = amountOfContext;

  /**
   * This function is used when the user initially searches.
   * It clears the `queryData` array from old results and then adds new results to the empty array.
   */
  @action loadResults = () => {
    this.clearResults();
    this.loadMoreResults();
  }
  /**
   * This function is used when the 'Load more' button is clicked.
   * It will add more results to the `queryData` array by sending a query request to the server 
   * to retrieve results matching the query.
   */
  @action loadMoreResults = async () => {
    applicationStore.loading();
    let grades = { ...queryFilterStore.grades };
    if (Object.keys(grades).reduce((acc, grade) => acc + (grades[grade] ? 0 : 1), 0) === Object.keys(grades).length) {
      Object.keys(grades).forEach(grade => grades[grade] = !grades[grade]);
    }
    let documents = { ...queryFilterStore.documents };
    if (Object.keys(documents).reduce((acc, document) => acc + (documents[document] ? 0 : 1), 0) === Object.keys(documents).length) {
      Object.keys(documents).forEach(document => documents[document] = !documents[document]);
    }
    const query = this.query.replace(/\[\]/g, '[word=""]');
    if(this.currentActiveQuery !== this.query){
      this.currentActiveQuery = this.query;
      this.clearResults();
    }
    const offset = this.queryData.length;
    let response;
    try {
      response = await request
        .post(`${window.location.href}cql_query/${applicationStore.getCorpus()}/${offset}`)
        .set("x-access-token", Cookies.get('token'))
        .send({
          query,
          grades,
          documents
        });
    } catch (error) {
      errorStore.setError(`Cannot load more results \u2014 ${error}`, error.response.status);
      applicationStore.doneLoading();
      return;
    }
    this.hasMore = response.body.has_more;
    const result = response.body.result.map(({ pre_words, targets, post_words }) => {
      return {
        preWords: pre_words,
        targets,
        postWords: post_words
      };
    });
    if (!result.length) {
      errorStore.setError('No results have been found');
    }
    this.queryData = [...this.queryData, ...result];
    applicationStore.doneLoading();
  }

  /**
   * Downloads an XML corresponding to the `id` and the selected `corpus` by sending a request to the server.
   * The response is a text string representing the XML, which is downloaded to user using an html hyperlink element.
   * 
   * @param {Number} id The ID of the frog file
   * @param {String} corpus The corpus
   */
  @action downloadXMLByFrogId = async (id, corpus) => {
    let response;
    try {
      response = await request
        .get(`${window.location.href}frog/${corpus}/${id}`)
        .set("x-access-token", Cookies.get('token'))
    } catch (error) {
      errorStore.setError(`XML download failed \u2014 ${error}`, error.response.status);
      return;
    }
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(response.text));
    element.setAttribute('download', id);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  @action clearResults = () => this.queryData = observable.array([]);

  /**
   * Sends a request to the server to retrieve frog data with the `id`.
   * 
   * @param {Number} id The ID of the frog file
   * @returns {Promise} A promise which, when resolved, returns the frog data corresponding the the `id`
   */
  @action getFrogDataById = (id) => {
    return new Promise(async (resolve, reject) => {
      applicationStore.loading();
      let frogData = {};
      try {
        frogData = await request
          .get(`${window.location.href}frog/${applicationStore.getCorpus()}/${id}/file`)
          .set("x-access-token", Cookies.get('token'))
        frogData = frogData.body.result;
      } catch (error) {
        errorStore.setError(`Frog data by ID request failed \u2014 ${error}`, error.response.status);
        reject(error)
      } finally {
        applicationStore.doneLoading();
        resolve(frogData);
      }
    });
  }

  /**
   * Downloads the results by sending an export request to the server while providing some search settings.
   * The response from the server is a CSV string, which is downloaded to the user using an html hyperlink element.
   */
  @action downloadAsCSV = async () => {
    applicationStore.loading();
    let grades = { ...queryFilterStore.grades };
    if (Object.keys(grades).reduce((acc, grade) => acc + (grades[grade] ? 0 : 1), 0) === Object.keys(grades).length) {
      Object.keys(grades).forEach(grade => grades[grade] = !grades[grade]);
    }
    let documents = { ...queryFilterStore.documents };
    if (Object.keys(documents).reduce((acc, document) => acc + (documents[document] ? 0 : 1), 0) === Object.keys(documents).length) {
      Object.keys(documents).forEach(document => documents[document] = !documents[document]);
    }
    let csv = null;
    try {
      const response = await request
        .get(`${window.location.href}query_export/${applicationStore.getCorpus()}`)
        .query({
          query: this.query,
          grades,
          documents,
          context: this.amountOfContext,
        })
        .set("x-access-token", Cookies.get('token'))
        .send();
      csv = response.body.export;
    } catch (error) {
      errorStore.setError(`Download failed \u2014 ${error}`);
      applicationStore.doneLoading();
    }
    if (csv) {
      const link = document.createElement("a");
      link.setAttribute("href", csv);
      link.setAttribute("download", "output.csv");
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link);
    }
    applicationStore.doneLoading();
  }

  @action switchCQLMode = () => {
    this.CQLMode = !this.CQLMode;
    this.query = '';
  };

  @action switchStrictMode = () => this.strictMode = !this.strictMode;

}

const queryStore = window.queryStore = new QueryStore();

export default queryStore;
