import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const MusicCoreApi = createApi({
    reducerPath: 'MusciCoreApi',
    baseQuery: fetchBaseQuery({
      baseUrl: 'http://localhost:5000/',
    }),
    endpoints: (builder) => ({
      getTopCharts: builder.query({ query: () => '/songs' }),
      getsearch: builder.query({ query: () => '/search' }),
    }),
  });
  
  export const {
    useGetTopChartsQuery,
    useGetsearchQuery
  } = MusicCoreApi;
  