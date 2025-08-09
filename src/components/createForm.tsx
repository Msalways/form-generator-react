import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { createNewTemplate, addFieldToCurrent } from "../redux/formSlice";
import FieldEditor from "./FieldEditor";
import { Box, Button, Typography } from "@mui/material";
import type { FormField } from "../types/form";

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(
    (state: RootState) => state.forms.currentTemplate
  );

  // Start new template
  const handleCreateTemplate = () => {
    dispatch(
      createNewTemplate({
        id: "", // Will be replaced in slice
        title: `Form ${Date.now()}`,
        createdAt: "",
        fields: [],
      })
    );
  };

  // Add field via FieldEditor
  const handleAddField = (field: Omit<FormField, "id">) => {
    console.log("Adding field:", field);

    dispatch(addFieldToCurrent(field));
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Create Form
      </Typography>

      {!currentTemplate ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTemplate}
        >
          Create New Template
        </Button>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Editing: {currentTemplate.title}
          </Typography>

          {/* FieldEditor */}
          <FieldEditor onAddField={handleAddField} />

          {/* Preview Fields */}
          <Box mt={3}>
            <Typography variant="h6">Preview:</Typography>
            {currentTemplate.fields.map((f) => (
              <div key={f.id}>
                <strong>{f.label}</strong> ({f.type})
              </div>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CreateForm;
