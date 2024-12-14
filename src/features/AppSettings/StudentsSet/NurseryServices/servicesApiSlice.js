import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice"

const servicesAdapter = createEntityAdapter({});

const initialState = servicesAdapter.getInitialState();

export const servicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => `/settings/studentsSet/services`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedServices = responseData.map((service) => {
          service.id = service._id;
          return service;
        });
        return servicesAdapter.setAll(initialState, loadedServices);
      },
      providesTags: ["service"],
   
    }),
    getServicesByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/settings/studentsSet/services?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData)

        const newLoadedServices = responseData.map((service) => {
          service.id = service._id; //changed the _id from mongoDB to id
          delete service._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return service;
        });
        return servicesAdapter.setAll(initialState, newLoadedServices);
      },
      providesTags: ["service"],
    }),
    getServicesById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/settings/studentsSet/services?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

    
      providesTags: ["service"],
    }),
    addNewService: builder.mutation({
      query: (initialServiceData) => ({
        url: "/settings/studentsSet/services",
        method: "POST",
        body: {
          ...initialServiceData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "service", id: "LIST" }, //the service list will be unvalidated and updated
      ],
    }),
    updateService: builder.mutation({
      query: (initialServiceData) => ({
        url: "/settings/studentsSet/services",
        method: "PATCH",
        body: {
          ...initialServiceData,
        },
      }),
      invalidatesTags: ["service"],
    }),
    deleteService: builder.mutation({
      query: ({ id }) => ({
        url: "/settings/studentsSet/services",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["service"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServicesByYearQuery,
  useGetServicesByIdQuery,
  useAddNewServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApiSlice;

// returns the query result object
export const selectServicesResult =
  servicesApiSlice.endpoints.getServices.select();

// creates memoized selector
const selectServicesData = createSelector(
  selectServicesResult,
  (servicesResult) => servicesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllServices,
  selectById: selectServiceById,
  selectIds: selectServiceIds,
  // Pass in a selector that returns the services slice of state
} = servicesAdapter.getSelectors(
  (state) => selectServicesData(state) ?? initialState
);
