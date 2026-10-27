import { configureStore } from '@reduxjs/toolkit';
import { placementApi } from './api/placementApi';
import { gamificationApi } from './api/gamificationApi';
import labFiltersReducer from './labFiltersSlice';

export const store = configureStore({
  reducer: {
    [placementApi.reducerPath]: placementApi.reducer,
    [gamificationApi.reducerPath]: gamificationApi.reducer,
    labFilters: labFiltersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(placementApi.middleware, gamificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
