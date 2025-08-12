import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { moviesReducer, type MovieState } from './Movies';
import { alertReducer, type AlertState } from './Alerts';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage padrão

export interface StoreState {
  movies: MovieState;
  alerts: AlertState;
}

const persistConfig = {
  key: 'root',   // chave no localStorage
  storage,
  whitelist: ['movies'] // só persistir o slice "movies"
};

const rootReducer = combineReducers({
  movies: moviesReducer,
  alerts: alertReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware())
);

export const persistor = persistStore(store);
