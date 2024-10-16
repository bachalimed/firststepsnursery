import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice"

const sectionsAdapter = createEntityAdapter({});

const initialState = sectionsAdapter.getInitialState();

export const sectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query({
      query: () => `/academics/sections`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedSections = responseData.map((section) => {
          section.id = section._id;
          return section;
        });
        return sectionsAdapter.setAll(initialState, loadedSections);
      },
      providesTags: ["section"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'section', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'section', id }))
      //         ]
      //     } else return [{ type: 'section', id: 'LIST' }]
      // }
    }),
    getSectionsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/academics/sections?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedSections = responseData.map((section) => {
          section.id = section._id; //changed the _id from mongoDB to id
          delete section._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return section;
        });
        return sectionsAdapter.setAll(initialState, newLoadedSections);
      },
      providesTags: ["section"],
    }),
    addNewSection: builder.mutation({
      query: (initialSectionData) => ({
        url: "/academics/sections",
        method: "POST",
        body: {
          ...initialSectionData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "section", id: "LIST" }, //the section list will be unvalidated and updated
      ],
    }),
    updateSection: builder.mutation({
      query: (initialSectionData) => ({
        url: "/academics/sections",
        method: "PATCH",
        body: {
          ...initialSectionData,
        },
      }),
      invalidatesTags: ["section"],
    }),
    deleteSection: builder.mutation({
      query: ({ id }) => ({
        url: "/academics/sections",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["section"],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useGetSectionsByYearQuery,
  useAddNewSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionsApiSlice;

// returns the query result object
export const selectSectionsResult =
  sectionsApiSlice.endpoints.getSections.select();

// creates memoized selector
const selectSectionsData = createSelector(
  selectSectionsResult,
  (sectionsResult) => sectionsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllSections,
  selectById: selectSectionById,
  selectIds: selectSectionIds,
  // Pass in a selector that returns the sections slice of state
} = sectionsAdapter.getSelectors(
  (state) => selectSectionsData(state) ?? initialState
);
