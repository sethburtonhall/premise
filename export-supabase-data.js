const { createClient } = require('@supabase/supabase-js');

// Supabase connection
const supabase = createClient(
  'http://127.0.0.1:54331',
  'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
);

async function exportData() {
  try {
    console.log('Exporting data from Supabase...');
    
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
    const fs = require('fs');
    fs.writeFileSync('exported-scopes.json', JSON.stringify(scopes, null, 2));
    console.log('Data saved to exported-scopes.json');
    
  } catch (err) {
    console.error('Connection error - make sure Supabase local is running:', err.message);
  }
}

exportData();
