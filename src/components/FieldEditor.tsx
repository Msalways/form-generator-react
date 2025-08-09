import React, { useEffect } from "react";
import type { FieldType, FormField } from "../types/form";
import { Controller, useForm } from "react-hook-form";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, ExpandMore } from "@mui/icons-material";

interface FieldEditorProps {
  currentFields: FormField[]; // used to check duplicates
  editingField?: FormField | null;
  onAddField: (field: Omit<FormField, "id">) => void;
  onUpdateField: (id: string, field: Omit<FormField, "id">) => void;
  resetSignal?: number;
}

interface FieldEditorForm {
  name: string;
  type: FieldType;
  required: boolean;
  optionValue?: string;
  options: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  regex?: string;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  currentFields,
  editingField = null,
  onAddField,
  onUpdateField,
  resetSignal,
}) => {
  const { control, handleSubmit, watch, reset, setValue, getValues } =
    useForm<FieldEditorForm>({
      defaultValues: {
        name: "",
        type: "text",
        required: false,
        optionValue: "",
        options: [],
        placeholder: "",
        min: undefined,
        max: undefined,
        regex: "",
      },
    });

  useEffect(() => {
    if (editingField) {
      reset({
        name: editingField.name,
        type: editingField.type,
        required: editingField.required,
        optionValue: "",
        options: editingField.options || [],
        placeholder: editingField.placeholder || "",
        min: editingField.validation?.min,
        max: editingField.validation?.max,
        regex: editingField.validation?.regex || "",
      });
    } else {
      reset({
        name: "",
        type: "text",
        required: false,
        optionValue: "",
        options: [],
        placeholder: "",
        min: undefined,
        max: undefined,
        regex: "",
      });
    }
  }, [editingField, resetSignal, reset]);

  const selectedType = watch("type");

  const onSubmit = (data: FieldEditorForm) => {
    // uniqueness check (case-insensitive), exclude editing field itself
    const duplicate = currentFields.some(
      (f) =>
        f.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
        f.id !== editingField?.id
    );
    if (duplicate) {
      window.alert("Field name must be unique within the form.");
      return;
    }

    const prepared: Omit<FormField, "id"> = {
      name: data.name,
      label: data.name,
      value: "",
      type: data.type,
      required: data.required,
      placeholder: data.placeholder,
      options:
        ["dropdown", "radio", "checkbox"].includes(data.type) && data.options
          ? data.options
          : [],
      validation: {
        min: data.min,
        max: data.max,
        regex: data.regex || undefined,
      },
    };

    if (editingField) {
      onUpdateField(editingField.id, prepared);
    } else {
      onAddField(prepared);
    }

    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: "Field name is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Field Name (unique)"
            variant="outlined"
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select {...field} fullWidth>
            {[
              "text",
              "number",
              "email",
              "password",
              "dropdown",
              "radio",
              "checkbox",
            ].map((t) => (
              <MenuItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Box display="flex" alignItems="center" gap={1}>
        <Controller
          name="required"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.checked)
              }
            />
          )}
        />
        <Typography>Required</Typography>
      </Box>

      {["dropdown", "radio", "checkbox"].includes(selectedType) && (
        <>
          <Box display="flex" gap={2}>
            <Controller
              name="optionValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Option Value"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Button
              variant="outlined"
              onClick={() => {
                const val = getValues("optionValue");
                if (!val) return;
                setValue("options", [...getValues("options"), val]);
                setValue("optionValue", "");
              }}
            >
              Add
            </Button>
          </Box>

          <List dense>
            {getValues("options").map((opt) => (
              <ListItem
                key={opt}
                secondaryAction={
                  <IconButton
                    onClick={() =>
                      setValue(
                        "options",
                        getValues("options").filter((o) => o !== opt)
                      )
                    }
                  >
                    <Delete />
                  </IconButton>
                }
              >
                {opt}
              </ListItem>
            ))}
          </List>
        </>
      )}

      {selectedType === "text" && (
        <Controller
          name="placeholder"
          control={control}
          render={({ field }) => <TextField {...field} label="Placeholder" />}
        />
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Validation Rules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="min"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Min Length / Value"
                  type="number"
                />
              )}
            />
            <Controller
              name="max"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Max Length / Value"
                  type="number"
                />
              )}
            />
            <Controller
              name="regex"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Regex Pattern" />
              )}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editingField ? "Update Field" : "Add Field"}
      </Button>
    </Box>
  );
};

export default FieldEditor;
