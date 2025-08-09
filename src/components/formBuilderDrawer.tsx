// src/components/FormBuilderDrawer.tsx
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Divider,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { Delete, Close, Edit } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import {
  addFieldToCurrent,
  removeFieldFromCurrent,
  createNewTemplate,
  updateFieldInCurrent,
} from "../redux/formSlice";
import FieldEditor from "./FieldEditor";
import type { FormField } from "../types/form";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FormBuilderDrawer: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(
    (state: RootState) => state.forms.currentTemplate
  );

  const [formTitle, setFormTitle] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  useEffect(() => {
    if (open) {
      setResetSignal((s) => s + 1);
      setEditingField(null);
      setFormTitle("");
    }
  }, [open]);

  const startNewForm = () => {
    if (!formTitle.trim()) {
      alert("Please provide a form title.");
      return;
    }
    dispatch(createNewTemplate({ title: formTitle }));
    setFormTitle("");
  };

  const handleAddField = (f: Omit<FormField, "id">) => {
    dispatch(addFieldToCurrent(f));
  };

  const handleUpdateField = (id: string, f: Omit<FormField, "id">) => {
    dispatch(updateFieldInCurrent({ id, updated: f }));
    setEditingField(null);
  };

  const handleDeleteField = (id: string) => {
    if (!confirm("Delete this field?")) return;
    dispatch(removeFieldFromCurrent(id));
  };

  const handleSaveClose = () => {
    // state already persisted inside reducers
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      PaperProps={{
        sx: { width: "80%", display: "flex", flexDirection: "column" },
      }}
    >
      {/* Header */}
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid #e0e0e0"
      >
        <Typography variant="h6">
          {currentTemplate?.title ?? "Form Builder"}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Body */}
      <Box display="flex" flex={1} overflow="hidden">
        {/* Left: Field list & create form */}
        <Box flex={1} p={2} borderRight="1px solid #e0e0e0" overflow="auto">
          {!currentTemplate ? (
            <Box>
              <Typography variant="subtitle1">Create New Form</Typography>
              <TextField
                label="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={startNewForm}>
                Start Form
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="subtitle1">Fields</Typography>
              <List>
                {currentTemplate.fields.map((field) => (
                  <ListItem
                    key={field.id}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => setEditingField(field)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <Box>
                      <Typography>
                        {field.label}{" "}
                        <Typography
                          component="span"
                          sx={{ fontSize: 12, color: "text.secondary" }}
                        >
                          ({field.type})
                        </Typography>
                      </Typography>
                      {field.options && field.options.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Options: {field.options.join(", ")}
                        </Typography>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>

        {/* Right: Field editor */}
        <Box flex={1} p={2} overflow="auto">
          {currentTemplate ? (
            <>
              <Typography variant="subtitle1">
                {editingField ? "Edit Field" : "Add Field"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FieldEditor
                currentFields={currentTemplate.fields}
                editingField={editingField}
                onAddField={handleAddField}
                onUpdateField={handleUpdateField}
                resetSignal={resetSignal}
              />
            </>
          ) : (
            <Typography sx={{ mt: 2 }}>Start a form to add fields.</Typography>
          )}
        </Box>
      </Box>

      {/* Footer - Cancel / Save */}
      <Box
        p={2}
        borderTop="1px solid #e0e0e0"
        display="flex"
        justifyContent="flex-end"
        gap={2}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveClose}>
          Save Form
        </Button>
      </Box>
    </Drawer>
  );
};

export default FormBuilderDrawer;
