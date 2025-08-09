import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { FormTemplate } from "../types/form";

interface FormPreviewModalProps {
  open: boolean;
  onClose: () => void;
  form: FormTemplate | null;
}

const FormPreviewModal = ({ open, onClose, form }: FormPreviewModalProps) => {
  // Setup react-hook-form
  const { handleSubmit, control } = useForm({
    defaultValues:
      form?.fields?.reduce((acc: Record<string, unknown>, field) => {
        acc[field.name] = field.type === "checkbox" ? [] : "";
        return acc;
      }, {} as Record<string, unknown>) ?? {},
  });

  // Handle submit
  const onSubmit = (data: unknown) => {
    console.log("Form Data:", data);

    alert("Submitted! Check console for data.");

    onClose();
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{form.title} - Preview</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {form.fields.map((field) => {
            switch (field.type) {
              case "text":
              case "email":
              case "password":
              case "number":
                return (
                  <Controller
                    key={field.id}
                    name={field.name}
                    control={control}
                    rules={{ required: field.required }}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        label={field.label}
                        type={field.type}
                        fullWidth
                        margin="normal"
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                  />
                );
              case "dropdown":
                return (
                  <FormControl key={field.id} fullWidth margin="normal">
                    <FormLabel>{field.label}</FormLabel>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={{ required: field.required }}
                      render={({ field: controllerField }) => (
                        <Select {...controllerField}>
                          {field.options?.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                );
              case "radio":
                return (
                  <FormControl
                    key={field.id}
                    component="fieldset"
                    margin="normal"
                  >
                    <FormLabel>{field.label}</FormLabel>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={{ required: field.required }}
                      render={({ field: controllerField }) => (
                        <RadioGroup {...controllerField}>
                          {field.options?.map((opt) => (
                            <FormControlLabel
                              key={opt}
                              value={opt}
                              control={<Radio />}
                              label={opt}
                            />
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                );
              case "checkbox":
                return (
                  <FormControl
                    key={field.id}
                    component="fieldset"
                    margin="normal"
                  >
                    <FormLabel>{field.label}</FormLabel>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          {field.options?.map((opt) => (
                            <FormControlLabel
                              key={opt}
                              control={
                                <Checkbox
                                  checked={
                                    (
                                      (controllerField.value as string[]) ?? []
                                    )?.includes(opt) ?? false
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      controllerField.onChange([
                                        ...(Array.isArray(controllerField.value)
                                          ? controllerField.value
                                          : []),
                                        opt,
                                      ]);
                                    } else {
                                      controllerField.onChange(
                                        (Array.isArray(controllerField.value)
                                          ? controllerField.value
                                          : []
                                        ).filter((v: string) => v !== opt)
                                      );
                                    }
                                  }}
                                />
                              }
                              label={opt}
                            />
                          ))}
                        </>
                      )}
                    />
                  </FormControl>
                );
              default:
                return null;
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormPreviewModal;
