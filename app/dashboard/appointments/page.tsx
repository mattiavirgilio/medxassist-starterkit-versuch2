"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";

const localizer = momentLocalizer(moment);

interface Appointment {
  id: string;
  title: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  notes: string;
  start: Date;
  end: Date;
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState<{
    title: string;
    patient_id: string;
    start_time: string;
    end_time: string;
    notes: string;
  }>({
    title: "",
    patient_id: "",
    start_time: "",
    end_time: "",
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const appointmentListener = supabase
      .channel('public:appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload: RealtimePostgresChangesPayload<Appointment>) => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentListener);
    };
  }, []);

  async function fetchAppointments() {
    const { data, error } = await supabase.from("appointments").select("*");
    if (error) {
      console.error("Fehler beim Abrufen der Termine: ", error);
    } else {
      const formattedData = (data || []).map((appointment) => ({
        ...appointment,
        start: new Date(appointment.start_time),
        end: new Date(appointment.end_time),
        title: appointment.title,
      }));
      setAppointments(formattedData);
    }
  }

  async function addAppointment() {
    const { data, error } = await supabase.from("appointments").insert([newAppointment]);
    if (error) {
      console.error("Fehler beim Hinzufügen des Termins: ", error);
    } else {
      setAppointments((prev) => [...prev, ...(data || [])]);
      setNewAppointment({ title: "", patient_id: "", start_time: "", end_time: "", notes: "" });
      setOpen(false);
      fetchAppointments();
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="p-4 dark:bg-transparent dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kalender - Wochenansicht</h1>
        <Button onClick={handleOpen} color="primary" variant="contained">
          Neuer Termin
        </Button>
      </div>

      {/* Monatskalender von shadcn/ui für die linke Seite */}
      <div className="flex mb-4">
        <ShadcnCalendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border dark:bg-transparent dark:text-white mr-8"
        />

        {/* Kalender Wochenansicht angepasst für eine bessere Struktur */}
        <BigCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800, backgroundColor: "transparent", color: "white", flex: 1 }}
          defaultView="week"
          views={['week']}
          selectable
          onSelectEvent={(event) => console.log("Selected Event:", event)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#6b7280",
              color: "white",
              borderRadius: "5px",
              padding: "5px",
            },
          })}
          components={{
            toolbar: (props) => (
              <div className="flex justify-between mb-4">
                <div>
                  <Button onClick={() => props.onNavigate('TODAY')} variant="outlined" color="inherit">Heute</Button>
                  <Button onClick={() => props.onNavigate('PREV')} variant="outlined" color="inherit">Zurück</Button>
                  <Button onClick={() => props.onNavigate('NEXT')} variant="outlined" color="inherit">Weiter</Button>
                </div>
                <h2 className="text-xl font-bold dark:text-white">{moment(props.date).format("MMMM YYYY")}</h2>
              </div>
            ),
            week: {
              header: ({ label }) => (
                <div className="text-center font-bold dark:text-white">
                  {label}
                </div>
              ),
            },
          }}
        />
      </div>

      {/* Dialog zum Hinzufügen eines neuen Termins */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Neuen Termin hinzufügen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titel"
            type="text"
            fullWidth
            variant="outlined"
            value={newAppointment.title}
            onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Patienten-ID"
            type="text"
            fullWidth
            variant="outlined"
            value={newAppointment.patient_id}
            onChange={(e) => setNewAppointment({ ...newAppointment, patient_id: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Startzeit"
            type="datetime-local"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newAppointment.start_time}
            onChange={(e) => setNewAppointment({ ...newAppointment, start_time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Endzeit"
            type="datetime-local"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newAppointment.end_time}
            onChange={(e) => setNewAppointment({ ...newAppointment, end_time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Notizen"
            type="text"
            fullWidth
            variant="outlined"
            value={newAppointment.notes}
            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={addAppointment} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
