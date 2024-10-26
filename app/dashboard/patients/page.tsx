"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [newPatient, setNewPatient] = useState({ first_name: "", name: "", email: "", phone_number: "", date_of_birth: "", address: "", insurance_number: "" });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase.from("patients").select("*");
    if (error) {
      console.error("Fehler beim Abrufen der Patienten: ", error);
    } else {
      setPatients(data || []);
    }
  }

  async function addPatient() {
    try {
      const { data, error } = await supabase.from("patients").insert([newPatient]);
      if (error) {
        throw error;
      }
      setPatients((prev) => [...prev, ...(data || [])]);
      setNewPatient({ first_name: "", name: "", email: "", phone_number: "", date_of_birth: "", address: "", insurance_number: "" });
      setOpen(false);
      fetchPatients(); // Refresh the table after adding a new patient
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Patienten: ", error);
    }
  }

  async function deletePatients() {
    try {
      const { error } = await supabase.from("patients").delete().in("id", selectedPatients);
      if (error) {
        throw error;
      }
      setPatients((prev) => prev.filter((patient) => !selectedPatients.includes(patient.id)));
      setSelectedPatients([]);
    } catch (error) {
      console.error("Fehler beim Löschen der Patienten: ", error);
    }
  }

  function handleSelectPatient(id: number) {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  }

  function handleEditPatient(id: number) {
    setEditingPatientId(id);
    setEditOpen(true);
    const patientToEdit = patients.find((p) => p.id === id);
    if (patientToEdit) {
      setNewPatient({ ...patientToEdit });
    }
  }

  async function savePatient() {
    if (editingPatientId === null) return;
    try {
      const { error } = await supabase.from("patients").update({
        first_name: newPatient.first_name,
        name: newPatient.name,
        email: newPatient.email,
        phone_number: newPatient.phone_number,
        date_of_birth: newPatient.date_of_birth,
        address: newPatient.address,
        insurance_number: newPatient.insurance_number
      }).eq("id", editingPatientId);
      if (error) {
        throw error;
      }
      fetchPatients();
      setNewPatient({ first_name: "", name: "", email: "", phone_number: "", date_of_birth: "", address: "", insurance_number: "" });
      setEditOpen(false);
      setEditingPatientId(null);
    } catch (error) {
      console.error("Fehler beim Speichern der Patienten: ", error);
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  return (
    <div className="p-4 dark:bg-transparent dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patientenverwaltung</h1>
        <div className="flex items-center gap-2">
          {selectedPatients.length > 0 && (
            <>
              <IconButton onClick={deletePatients} color="secondary">
                <DeleteIcon className="dark:text-gray-400" />
              </IconButton>
              <IconButton onClick={() => handleEditPatient(selectedPatients[0])} color="primary">
                <EditIcon className="dark:text-gray-400" />
              </IconButton>
            </>
          )}
          <IconButton onClick={handleOpen} color="primary">
            <AddCircleIcon className="dark:text-gray-400" />
          </IconButton>
        </div>
      </div>

      {/* Dialog zum Hinzufügen eines neuen Patienten */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Neuen Patienten hinzufügen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vorname"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.first_name}
            onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefonnummer"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.phone_number}
            onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Geburtsdatum"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newPatient.date_of_birth}
            onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Adresse"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.address}
            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Versicherungsnummer"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.insurance_number}
            onChange={(e) => setNewPatient({ ...newPatient, insurance_number: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={addPatient} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog zum Bearbeiten eines Patienten */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Patienten bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vorname"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.first_name}
            onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefonnummer"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.phone_number}
            onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Geburtsdatum"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newPatient.date_of_birth}
            onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Adresse"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.address}
            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Versicherungsnummer"
            type="text"
            fullWidth
            variant="outlined"
            value={newPatient.insurance_number}
            onChange={(e) => setNewPatient({ ...newPatient, insurance_number: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={savePatient} color="primary">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabelle der Patienten */}
      <TableContainer component="div" className="bg-transparent">
        <Table className="bg-transparent">
          <TableHead className="bg-transparent">
            <TableRow className="border-b border-gray-400 dark:border-gray-800">
              <TableCell className="dark:text-gray-400 bg-transparent"></TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Vorname</TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Name</TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Email</TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Telefonnummer</TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Geburtsdatum</TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Adresse</TableCell>
              <TableCell className="dark:text-gray-400 bg-transparent">Versicherungsnummer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-transparent">
            {patients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <TableCell className="border-b border-gray-400 dark:border-gray-800 bg-transparent">
                  <Checkbox
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => handleSelectPatient(patient.id)}
                    className="dark:text-gray-400"
                  />
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.first_name}
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.name}
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.email}
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.phone_number}
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.date_of_birth}
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.address}
                </TableCell>
                <TableCell className="border-b border-gray-400 dark:border-gray-800 dark:text-gray-400 bg-transparent">
                  {patient.insurance_number}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
