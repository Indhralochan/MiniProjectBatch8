import { configureStore } from '@reduxjs/toolkit';

import { MusicCoreApi} from './services/MusicCoreApi';
import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    [MusicCoreApi.reducerPath]: MusicCoreApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(MusicCoreApi.middleware),
});
