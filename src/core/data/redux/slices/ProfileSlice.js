import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";
import { showToast } from "./ToastSlice";

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
  isLoading: false,
  role: "user",
  // error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (paginationData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/getUser", paginationData);
      localStorage.setItem("userId", response.data.data.id);

      return response.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/editProfile", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Edit profile response:", response.data);

      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteTemplate = createAsyncThunk(
  "profile/deleteTemplate",
  async (deleteTemplateData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete("/deleteTemplate", {
        data: deleteTemplateData,
      });
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Fetched profile data:", action.payload);
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
            state.templates.whatsappTemplates.whatsappTemplatePagination.totalTemplates += 1;
          }
        } else if (
          action.payload.data?.templates?.emailTemplates
            ?.emailTemplatesData?.[0]
        ) {
          const index =
            state.templates.emailTemplates.emailTemplatesData.findIndex(
              (template) =>
                template.emailTemplate_id ===
                action.payload.data.templates.emailTemplates
                  .emailTemplatesData[0].emailTemplate_id
            );
          if (index !== -1) {
            state.templates.emailTemplates.emailTemplatesData[index] =
              action.payload.data.templates.emailTemplates.emailTemplatesData[0];
          } else {
            state.templates.emailTemplates.emailTemplatesData.unshift(
              action.payload.data.templates.emailTemplates.emailTemplatesData[0]
            );
            state.templates.emailTemplates.emailTemplatePagination.totalTemplates += 1;
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
          state.templates.whatsappTemplates.whatsappTemplatePagination.totalTemplates -= 1;
        }
        if (templateType === "emailTemplate") {
          state.templates.emailTemplates.emailTemplatesData =
            state.templates.emailTemplates.emailTemplatesData.filter(
              (template) => template.emailTemplate_id !== template_id
            );
        }
        state.templates.emailTemplates.emailTemplatePagination.totalTemplates -= 1;
      });
  },
});
export default profileSlice.reducer;
export const { resetProfile } = profileSlice.actions;
