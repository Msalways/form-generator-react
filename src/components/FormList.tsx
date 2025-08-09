import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Delete, Visibility, Add, Edit } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { deleteForm, setCurrentTemplate } from "../redux/formSlice";
import FormPreviewModal from "./formPreviewModal";
import type { RootState } from "../redux/store";
import type { FormTemplate } from "../types/form";
import FormBuilderDrawer from "./formBuilderDrawer";

const FormsList: React.FC = () => {
  const forms = useSelector((state: RootState) => state.forms.templates);
  const dispatch = useDispatch();

  const [previewForm, setPreviewForm] = useState<FormTemplate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      dispatch(deleteForm(id));
    }
  };

  const handleEdit = (form: FormTemplate) => {
    dispatch(setCurrentTemplate(form)); // load into Redux for editing
    setDrawerOpen(true);
  };

  return (
    <Box>
      {/* Header with Add Form Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={4}
      >
        <Typography variant="h5" gutterBottom>
          All Forms
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            dispatch(setCurrentTemplate(null)); // reset to blank
            setDrawerOpen(true);
          }}
        >
          Add Form
        </Button>
      </Box>

      {forms.length === 0 ? (
        <Typography>No forms created yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Fields Count</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{form.title}</TableCell>
                  <TableCell>{form.fields.length}</TableCell>
                  <TableCell align="right">
                    <Button
                      startIcon={<Visibility />}
                      size="small"
                      onClick={() => setPreviewForm(form)}
                    >
                      Preview
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(form)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(form.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Preview Modal */}
      <FormPreviewModal
        open={!!previewForm}
        onClose={() => setPreviewForm(null)}
        form={previewForm}
      />

      {/* Form Builder Drawer */}
      <FormBuilderDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default FormsList;
