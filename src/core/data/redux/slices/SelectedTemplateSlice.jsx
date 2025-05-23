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
    emailTemplateSubject:"",
    emailTemplateBody:"",

  },
  reducers: {
    setSelectedTemplate: (state, action) => {
      const { templateType, emailTemplateTitle, emailTemplateSubject, emailTemplateBody, whatsappTemplateTitle, whatsappTemplateMessage,whatsappTemplate_id } = action.payload;

      state.templateType = templateType;
    

      if (templateType === "email") {
        state.emailTemplateTitle = emailTemplateTitle || "";
        state.emailTemplateSubject = emailTemplateSubject || "";
        state.emailTemplateBody = emailTemplateBody || "";
        state.emailTemplateTitle = "";
      } else if (templateType === "whatsapp") {
          state.whatsappTemplate_id = whatsappTemplate_id ||"";
          state.whatsappTemplateTitle = whatsappTemplateTitle ||"";
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
    emailTemplateSubject:"",
    emailTemplateBody:"",
    }),
  },
});

export const { setSelectedTemplate, resetSelectedTemplate } = selectedTemplateSlice.actions;
export default selectedTemplateSlice.reducer;
