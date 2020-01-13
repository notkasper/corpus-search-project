import { observable, action, computed } from 'mobx';
import ApplicationStore from './ApplicationStore';

class ThemeStore {
    @observable primaryColor = 'primary';

    @action reset = () => {
        this.primaryColor = 'primary';
    }

    @computed get color() {
        return ApplicationStore.basiscript ? 'secondary' : 'primary';
    }
}

const themeStore = window.themeStore = new ThemeStore();

export default themeStore;