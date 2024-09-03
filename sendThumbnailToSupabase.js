const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
const sendThumbnailToSupabase = async function (json) {
        
    fs.readFile('./temp/'+json.filename+'_page_1.png', async (err, fileData) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
    
        const supabase = createClient(process.env.URL, process.env.KEY); 
    
        const { data, error } = await supabase.storage
            .from('jpg')
            .upload(json.files+'/'+json.filename+'.jpg', fileData, {
                cacheControl: '3600',
                upsert: true,
                contentType: 'image/jpeg' 
            });
    
        if (error) {
            console.error('Error uploading file:', error.message);
        } else {
            console.log('File uploaded successfully:', data.Key);
            fs.unlink('./temp/'+json.filename+'_page_1.png', (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('Local file deleted successfully');
                }
            });
            fs.unlink('./temp/'+json.filename+'.jpg', (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('Local file deleted successfully');
                }
            });            
            fs.unlink('./temp/temp.pdf', (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('Local file deleted successfully');
                }
            });
        }
    });
    
};

module.exports = { sendThumbnailToSupabase };
