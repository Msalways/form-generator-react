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
import type { FormTemplate } from "../types/form";

interface FormPreviewModalProps {
  open: boolean;
  onClose: () => void;
  form: FormTemplate | null;
}

const FormPreviewModal = ({ open, onClose, form }: FormPreviewModalProps) => {
  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{form.title} - Preview</DialogTitle>
      <DialogContent dividers>
        {form.fields.map((field) => {
          switch (field.type) {
            case "text":
            case "email":
            case "password":
            case "number":
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  type={field.type}
                  fullWidth
                  margin="normal"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              );
            case "dropdown":
              return (
                <FormControl key={field.id} fullWidth margin="normal">
                  <FormLabel>{field.label}</FormLabel>
                  <Select>
                    {field.options?.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
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
                  <RadioGroup>
                    {field.options?.map((opt) => (
                      <FormControlLabel
                        key={opt}
                        value={opt}
                        control={<Radio />}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
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
                  {field.options?.map((opt) => (
                    <FormControlLabel
                      key={opt}
                      control={<Checkbox />}
                      label={opt}
                    />
                  ))}
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
      </DialogActions>
    </Dialog>
  );
};

export default FormPreviewModal;
