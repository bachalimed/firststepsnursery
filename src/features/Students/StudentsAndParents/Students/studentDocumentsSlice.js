import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    studentDocuments: [],
     // Assuming you want to manage a list of documents
    // You can also include other fields as needed
};

const studentDocumentsSlice = createSlice({
    name: 'studentDocument',
    initialState,

    reducers: {
        setStudentDocuments: (state, action) => {
            // Set the entire list of student documents
            state.studentDocuments = action.payload;
            
        },
        setSomeStudentDocuments: (state, action) => {
            // Add new student documents to the existing list
            state.studentDocuments = [...state.studentDocuments, ...action.payload];
        },
        updateStudentDocument: (state, action) => {
            // Update a specific student document
            const { id, changes } = action.payload;
            const index = state.studentDocuments.findIndex(doc => doc.id === id);
            if (index !== -1) {
                state.studentDocuments[index] = { ...state.studentDocuments[index], ...changes };
            }
        },
        setResult: (state, action) => {
            // Save the result to the state
            const { list } = action.payload;
            state.studentDocuments = list;
        },
    },
});

// Export actions
export const { setStudentDocuments, updateStudentDocument, setResult, setSomeStudentDocuments } = studentDocumentsSlice.actions;

// Selector to get the student documents from the state
export const selectStudentDocuments = (state) => state.studentDocument.studentDocuments;

// Export reducer
export default studentDocumentsSlice.reducer;