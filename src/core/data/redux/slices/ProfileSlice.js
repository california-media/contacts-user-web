import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

const initialState = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  phonenumbers: [],
  profileImageURL: "",
  contactCount: 0,
  // whatsappTemplates: [],
  // emailTemplates: [],
  favouriteCount: 0,
  tagCount: 0,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (paginationData, { rejectWithValue }) => {
    
    try {
      const response = await api.post("/getUser",paginationData);
      localStorage.setItem("userId", response.data.data.id);
      console.log(response.data, "response from fetch profile");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put("/editProfile", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteTemplate = createAsyncThunk(
  "profile/deleteTemplate",
  async (deleteTemplateData, { rejectWithValue }) => {

    try {
      const response = await api.delete("/deleteTemplate", {
        data: deleteTemplateData,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;

        // return { ...state, ...action.payload };
        Object.assign(state, action.payload.data);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        if (
          action.payload.data?.templates?.whatsappTemplates
            ?.whatsappTemplatesData?.[0]
        ) {
          const index =
            state.templates.whatsappTemplates.whatsappTemplatesData.findIndex(
              (template) =>
                template.whatsappTemplate_id ===
                action.payload.data.templates.whatsappTemplates
                  .whatsappTemplatesData[0].whatsappTemplate_id
            );
          if (index !== -1) {
            state.templates.whatsappTemplates.whatsappTemplatesData[index] =
              action.payload.data.templates.whatsappTemplates.whatsappTemplatesData[0];
          } else {
            state.templates.whatsappTemplates.whatsappTemplatesData.unshift(
              action.payload.data.templates.whatsappTemplates
                .whatsappTemplatesData[0]
            );
            state.templates.whatsappTemplates.whatsappTemplatePagination.totalTemplates+=1;
          }
        } else if (
          action.payload.data?.templates?.emailTemplates?.emailTemplatesData?.[0]
        ) {
          const index =
            state.templates.emailTemplates.emailTemplatesData.findIndex(
              (template) =>
                template.emailTemplate_id ===
                action.payload.data.templates.emailTemplates.emailTemplatesData[0]
                  .emailTemplate_id
            );
          if (index !== -1) {
            state.templates.emailTemplates.emailTemplatesData[index] =
              action.payload.data.templates.emailTemplates.emailTemplatesData[0];
          } else {
            state.templates.emailTemplates.emailTemplatesData.unshift(
              action.payload.data.templates.emailTemplates.emailTemplatesData[0]
            );
            state.templates.emailTemplates.emailTemplatePagination.totalTemplates+=1;
          }
        }
      })
      .addCase(editProfile.rejected, (state, action) => {
        console.error("Edit profile failed", action.payload);
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        const { templateType, template_id } = action.payload;

        if (templateType === "whatsappTemplate") {
          state.templates.whatsappTemplates.whatsappTemplatesData =
            state.templates.whatsappTemplates.whatsappTemplatesData.filter(
              (template) => template.whatsappTemplate_id !== template_id
            );
          state.templates.whatsappTemplates.whatsappTemplatePagination.totalTemplates-=1;
        }
        if (templateType === "emailTemplate") {
          state.templates.emailTemplates.emailTemplatesData =
            state.templates.emailTemplates.emailTemplatesData.filter(
              (template) => template.emailTemplate_id !== template_id
            );
        }
        state.templates.emailTemplates.emailTemplatePagination.totalTemplates-=1;
      });
  },
});

export default profileSlice.reducer;
