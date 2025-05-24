import { createSlice } from "@reduxjs/toolkit";

const selectedTemplateSlice = createSlice({
  name: "selectedTemplate",
  initialState: {
    templateType: null,
    whatsappTemplate_id: "",
    emailTemplate_id: "",
    whatsappTemplateTitle: "",
    whatsappTemplateMessage: "",
    emailTemplateTitle: "",
    emailTemplateSubject: "",
    emailTemplateBody: "",
  },
  reducers: {
    setSelectedTemplate: (state, action) => {
      const {
        templateType,
        emailTemplateTitle,
        emailTemplateSubject,
        emailTemplateBody,
        whatsappTemplateTitle,
        whatsappTemplateMessage,
        whatsappTemplate_id,
        emailTemplate_id,
      } = action.payload;

      state.templateType = templateType;

      if (templateType === "email") {
        state.emailTemplate_id = emailTemplate_id || "";
        state.emailTemplateTitle = emailTemplateTitle || "";
        state.emailTemplateSubject = emailTemplateSubject || "";
        state.emailTemplateBody = emailTemplateBody || "";
      } else if (templateType === "whatsapp") {
        state.whatsappTemplate_id = whatsappTemplate_id || "";
        state.whatsappTemplateTitle = whatsappTemplateTitle || "";
        state.whatsappTemplateMessage = whatsappTemplateMessage || "";
      }
    },
    resetSelectedTemplate: () => ({
      templateType: null,
      whatsappTemplate_id: "",
      emailTemplate_id: "",
      whatsappTemplateTitle: "",
      whatsappTemplateMessage: "",
      emailTemplateTitle: "",
      emailTemplateSubject: "",
      emailTemplateBody: "",
    }),
  },
});

export const { setSelectedTemplate, resetSelectedTemplate } =
  selectedTemplateSlice.actions;
export default selectedTemplateSlice.reducer;
