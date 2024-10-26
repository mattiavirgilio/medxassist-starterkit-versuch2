"use client";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export async function POST(request: NextRequest) {
  const { user_id, patient_id, title, start_time, end_time, notes } = await request.json();

  const { data, error } = await supabase
    .from('appointments')
    .insert([{ user_id, patient_id, title, start_time, end_time, notes }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const { appointment_id, user_id, patient_id, title, start_time, end_time, notes } = await request.json();

  const { error } = await supabase
    .from('appointments')
    .update({ user_id, patient_id, title, start_time, end_time, notes })
    .eq('appointment_id', appointment_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Appointment updated successfully' }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { appointment_id } = await request.json();

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('appointment_id', appointment_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Appointment deleted successfully' }, { status: 200 });
}
