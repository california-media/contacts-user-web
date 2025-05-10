import { createSlice } from "@reduxjs/toolkit";

const tagSlice = createSlice({
    name: "tag",
    initialState: {
        allTags: [],
        tagValue: "",
        deleteTag: null,
        openGroupDeleteModal: false,
    },
})