import { configureStore } from '@reduxjs/toolkit';
import { placementApi } from './api/placementApi';

export const store = configureStore({
  reducer: {
    [placementApi.reducerPath]: placementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(placementApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
