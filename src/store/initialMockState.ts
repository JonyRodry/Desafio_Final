import { type StoreState } from './store';
import { moviesInitialState } from './Movies';
import { alertInitialState } from './Alerts';

export const mockState: StoreState = {
    movies: moviesInitialState,
    alerts: alertInitialState
}
