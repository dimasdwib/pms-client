import { createBrowserHistory, createMemoryHistory } from 'history';
const createHistory = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();

export default createHistory;
