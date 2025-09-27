import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  userEmail: string;
  userName: string;
  counselorName: string;
  sessionDate: string;
  sessionTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, counselorName, sessionDate, sessionTime }: BookingRequest = await req.json();
    
    console.log('Booking confirmed for:', userEmail);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Booking confirmed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-booking-confirmation function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Booking confirmation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);