import request from 'superagent';
import { observable, action } from 'mobx';
import _ from 'lodash';
import errorStore from './ErrorStore';
import Cookies from 'js-cookie';
import applicationStore from './ApplicationStore';


class FrequencyStore {
  @observable words = observable.array([]);
  @observable frequencyData = observable.array([]);
  @observable hasMore = false;
  @observable files = observable.array([]);
  @observable strictMode = true;
  @observable searchMode = 'word';

  @action setWords = (words) => this.words = words;

  @action reset = () => {
    this.frequencyData = observable.array([]);
    this.setWords(observable.array([]));
    this.strictMode = true;
  }

  /**
   * This function is used when the user initially searches.
   * It clears the `frequencyData` array from old results and then adds new results to the empty array.
   */
  @action findFrequencies = () => {
    this.frequencyData = observable.array([]);
    this.getFrequencyResponse(this.words);
  }

  /**
   * This function is used when the 'Load more' button is clicked.
   * It will add more results to the `frequencyData` array.
   */
  @action findMoreFrequencies = () => {
    this.getFrequencyResponse(this.words)
  }

  /**
   * Handles an import request by the user by creating an html input element and clicking it, 
   * which is used to allow the user to provide import files that are then read when selected.
   */
  @action handleImport = () => {
    const input = document.createElement("INPUT");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "");
    input.addEventListener("change", this.readFiles, false);
    input.click();
  }

  /**
   * Downloads the results by sending an export request to the server while providing some search settings.
   * The response from the server is a CSV string, which is downloaded to the user using an html hyperlink element.
   */
  @action downloadResults = async () => {
    applicationStore.loading();
    let csv = null;
    try {
      const response = await request
        .get(`${window.location.href}frequency_export/${applicationStore.getCorpus()}`)
        .query({
          queries: JSON.stringify(this.words),
          strict: this.strictMode,
          searchMode: this.searchMode
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
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", "frequency_data.csv");
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link);
    }
    applicationStore.doneLoading();
  }
  
  /**
   * Sends a frequency request to the server to retrieve the frequencies of `input`.
   * The response from the server are the matching results of `input`, which are appended to `frequencyData`.
   * 
   * @param {Array} input A list of queries
   */
  @action getFrequencyResponse = async (input) => {
    const offset = this.frequencyData.length;
    let response;
    try {
      response = await request
        .get(`${window.location.href}frequency/${applicationStore.getCorpus()}/words/${offset}`)
        .query({ queries: JSON.stringify(input), strict: this.strictMode, searchMode: this.searchMode })
        .set("x-access-token", Cookies.get('token'))
        .send();
    } catch (error) {
      errorStore.setError(`Error while getting frequencies ${error}`, error.response.status);
      return;
    }

    if (!_.get(response, 'body.result.length')) {
      errorStore.setError(`No results for '${input}'`);
    }
    this.hasMore = response.body.has_more;
    this.frequencyData = [...this.frequencyData, ...response.body.result];
  }

  /**
   * Reads the files only if these are of .txt format. 
   * Each file's content is split by comma to seperate the queries 
   * and to put them in a list to be provided to `getFrequencyResponse` 
   * in order to retrieve the frequencies.
   * 
   * @param {Event} event The event which contains the files selected for import
   */
  @action readFiles = (event) => {
    const fileList = event.currentTarget.files;
    const queries = [];
    for (let i = 0; i < fileList.length; i++) {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const text = event.target.result;
        const term = text.split(',');
        queries.push(term);
        if (i === fileList.length - 1) {
          this.getFrequencyResponse(_.flattenDeep(queries));
        }
      };

      if (fileList[i].type === 'text/plain') {
        fileReader.readAsText(fileList[i]);
      } else {
        errorStore.setError(`Invalid file type: ${fileList[i].type}`)
      }
    }
  }

  @action switchStrictMode = () => this.strictMode = !this.strictMode;
  @action setSearchMode = (event) => this.searchMode = event.target.value;
}

const frequencyStore = window.frequencyStore = new FrequencyStore();

export default frequencyStore;
