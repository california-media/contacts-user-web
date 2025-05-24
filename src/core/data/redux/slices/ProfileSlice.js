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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/getUser");
      localStorage.setItem("userId", response.data.data.id);
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
      console.log(response.data, "response from edit profile");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteTemplate = createAsyncThunk(
  "profile/deleteTemplate",
  async (deleteTemplateData, { rejectWithValue }) => {
    console.log("deleteTemplateData", deleteTemplateData);

    try {
      const response = await api.delete("/deleteTemplate", {
        data: deleteTemplateData,
      });
      console.log("response from delete template", response.data.data);

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
        console.log("edit profile response action.payload", action.payload);
        console.log(
          "edit profile response state (after update)",
          JSON.parse(JSON.stringify(state))
        );
        if (
          action.payload?.templates?.whatsappTemplates
            ?.whatsappTemplatesData?.[0]
        ) {
          const index =
            state.templates.whatsappTemplates.whatsappTemplatesData.findIndex(
              (template) =>
                template.whatsappTemplate_id ===
                action.payload.templates.whatsappTemplates
                  .whatsappTemplatesData[0].whatsappTemplate_id
            );
          if (index !== -1) {
            state.templates.whatsappTemplates.whatsappTemplatesData[index] =
              action.payload.templates.whatsappTemplates.whatsappTemplatesData[0];
          } else {
            state.templates.whatsappTemplates.whatsappTemplatesData.unshift(
              action.payload.templates.whatsappTemplates
                .whatsappTemplatesData[0]
            );
          }
        } else if (
          action.payload?.templates?.emailTemplates?.emailTemplatesData?.[0]
        ) {
          const index =
            state.templates.emailTemplates.emailTemplatesData.findIndex(
              (template) =>
                template.emailTemplate_id ===
                action.payload.templates.emailTemplates.emailTemplatesData[0]
                  .emailTemplate_id
            );
          if (index !== -1) {
            state.templates.emailTemplates.emailTemplatesData[index] =
              action.payload.templates.emailTemplates.emailTemplatesData[0];
          } else {
            state.templates.emailTemplates.emailTemplatesData.unshift(
              action.payload.templates.emailTemplates.emailTemplatesData[0]
            );
          }
        }
      })
      .addCase(editProfile.rejected, (state, action) => {
        console.error("Edit profile failed", action.payload);
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        const { templateType, template_id } = action.payload;
        console.log(
          "delete template response state",
          JSON.parse(JSON.stringify(state))
        );

        if (templateType === "whatsappTemplate") {
          state.templates.whatsappTemplates.whatsappTemplatesData =
            state.templates.whatsappTemplates.whatsappTemplatesData.filter(
              (template) => template.whatsappTemplate_id !== template_id
            );
        }
        if (templateType === "emailTemplate") {
          state.templates.emailTemplates.emailTemplatesData =
            state.templates.emailTemplates.emailTemplatesData.filter(
              (template) => template.emailTemplate_id !== template_id
            );
        }
      });
  },
});

export default profileSlice.reducer;
