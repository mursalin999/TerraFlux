import { publicServerClient } from "./src/lib/supabase-public.server";
const { data, error } = await publicServerClient().from("global_fire_cells").select("id,acq_date").limit(1); console.log(JSON.stringify({rows:data?.length??0,error:error?.message??null}));
