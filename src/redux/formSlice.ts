// src/redux/formSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { FormTemplate, FormField } from "../types/form";

interface FormsState {
  templates: FormTemplate[];
  currentTemplate: FormTemplate | null;
}

const initialState: FormsState = {
  templates: [],
  currentTemplate: null,
};

const STORAGE_KEY = "formTemplates_v1";

const persistTemplates = (templates: FormTemplate[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {
    console.warn("Failed to persist templates", e);
  }
};

const formSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    loadTemplatesFromStorage(state) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          state.templates = JSON.parse(raw);
        } catch {
          state.templates = [];
        }
      }
    },

    createNewTemplate(state, action: PayloadAction<{ title: string }>) {
      const newTemplate: FormTemplate = {
        id: uuidv4(),
        title: action.payload.title,
        createdAt: new Date().toISOString(),
        fields: [],
      };
      state.currentTemplate = newTemplate;
      // push to templates list and persist
      state.templates.push(newTemplate);
      persistTemplates(state.templates);
    },

    setCurrentTemplateById(state, action: PayloadAction<string>) {
      const t = state.templates.find((x) => x.id === action.payload);
      state.currentTemplate = t ? { ...t } : null;
    },
    setCurrentTemplate(state, action: PayloadAction<FormTemplate | null>) {
      state.currentTemplate = action.payload;
    },

    addFieldToCurrent(state, action: PayloadAction<Omit<FormField, "id">>) {
      if (!state.currentTemplate) return;
      const newField: FormField = { ...action.payload, id: uuidv4() };
      state.currentTemplate.fields.push(newField);

      // update template in templates array
      const idx = state.templates.findIndex(
        (t) => t.id === state.currentTemplate!.id
      );
      if (idx !== -1) state.templates[idx] = { ...state.currentTemplate };
      persistTemplates(state.templates);
    },

    updateFieldInCurrent(
      state,
      action: PayloadAction<{ id: string; updated: Omit<FormField, "id"> }>
    ) {
      if (!state.currentTemplate) return;
      const idx = state.currentTemplate.fields.findIndex(
        (f) => f.id === action.payload.id
      );
      if (idx === -1) return;
      state.currentTemplate.fields[idx] = {
        id: action.payload.id,
        ...action.payload.updated,
      };

      // persist
      const tIndex = state.templates.findIndex(
        (t) => t.id === state.currentTemplate!.id
      );
      if (tIndex !== -1) state.templates[tIndex] = { ...state.currentTemplate };
      persistTemplates(state.templates);
    },

    removeFieldFromCurrent(state, action: PayloadAction<string>) {
      if (!state.currentTemplate) return;
      state.currentTemplate.fields = state.currentTemplate.fields.filter(
        (f) => f.id !== action.payload
      );

      const idx = state.templates.findIndex(
        (t) => t.id === state.currentTemplate!.id
      );
      if (idx !== -1) state.templates[idx] = { ...state.currentTemplate };
      persistTemplates(state.templates);
    },

    deleteForm(state, action: PayloadAction<string>) {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
      if (state.currentTemplate?.id === action.payload)
        state.currentTemplate = null;
      persistTemplates(state.templates);
    },

    reorderFields(
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>
    ) {
      if (!state.currentTemplate) return;
      const fields = state.currentTemplate.fields;
      const [removed] = fields.splice(action.payload.startIndex, 1);
      fields.splice(action.payload.endIndex, 0, removed);

      const idx = state.templates.findIndex(
        (t) => t.id === state.currentTemplate!.id
      );
      if (idx !== -1) state.templates[idx] = { ...state.currentTemplate };
      persistTemplates(state.templates);
    },
  },
});

export const {
  loadTemplatesFromStorage,
  createNewTemplate,
  setCurrentTemplateById,
  addFieldToCurrent,
  updateFieldInCurrent,
  removeFieldFromCurrent,
  deleteForm,
  reorderFields,
  setCurrentTemplate,
} = formSlice.actions;

export default formSlice.reducer;
