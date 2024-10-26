import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export async function POST(request: NextRequest) {
  const { name, first_name, date_of_birth, phone_number, email, address, insurance_number } = await request.json();

  const { data, error } = await supabase
    .from('patients')
    .insert([{ name, first_name, date_of_birth, phone_number, email, address, insurance_number }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

