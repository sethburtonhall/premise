import { createClient } from '@supabase/supabase-js';

// Supabase production connection
const supabase = createClient(
  'https://your-project.supabase.co', // You'll need to provide this
  'your-anon-key' // You'll need to provide this
);

async function exportProductionData() {
  try {
    console.log('Exporting data from Supabase production...');
    
    const { data: scopes, error } = await supabase
      .from('scopes')
      .select('*');
    
    if (error) {
      console.error('Error exporting data:', error);
      return;
    }
    
    console.log(`Found ${scopes.length} scopes to export:`);
    console.log(JSON.stringify(scopes, null, 2));
    
    // Save to file for import
    const fs = await import('fs');
    fs.writeFileSync('exported-production-scopes.json', JSON.stringify(scopes, null, 2));
    console.log('Data saved to exported-production-scopes.json');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

exportProductionData();
