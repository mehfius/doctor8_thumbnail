const functions = require('@google-cloud/functions-framework');
const { template_prescricao } = require('./template_prescricao');
const cors = require('cors');
const corsMiddleware = cors({ origin: true });
const { prontuario } = require('./prontuario');
const { fromBuffer } = require('pdf2pic');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { createClient } = require("@supabase/supabase-js");

functions.http('thumbnail', async (req, res) => {
    corsMiddleware(req, res, async () => {
        try {
            
            let json = await prontuario(req);
            let pdfBuffer = await template_prescricao(json);
  
            let uuid = uuidv4()
            filePath = './temp/'+uuid

            const pdf2picOptions = {
                format: 'png',
                width: 2550,
                height: 3300,
                density: 330,
                saveFilename: filePath
            };

            const convertPdfToPng = fromBuffer(pdfBuffer, pdf2picOptions);

            const pageNumber = 1;
            const result = await convertPdfToPng(pageNumber);

            const supabase = createClient(process.env.URL, process.env.KEY);


            fs.readFile(filePath+'.1.png', async (err, fileData) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }
            
                const supabase = createClient(process.env.URL, process.env.KEY); 
            
                const { data, error } = await supabase.storage
                    .from('js')
                    .upload(uuid+".png", fileData, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: 'image/png' 
                    });
            
                if (error) {
                    console.error('Error uploading file:', error.message);
                } else {
                    console.log('File uploaded successfully:', data.Key);
                    fs.unlink(filePath+'.1.png', (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('Local file deleted successfully');
                        }
                    });
                }
            });

        } catch (error) {
            console.error('Erro ao converter PDF:', error);
            res.status(500).send('Erro ao converter PDF');
        }
    });
});
