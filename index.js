const functions = require('@google-cloud/functions-framework');
const { template_prescricao } = require('./template_prescricao');
const cors = require('cors');
const corsMiddleware = cors({ origin: true });
const { prontuario } = require('./prontuario');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require("@supabase/supabase-js");
const { thumbnail } = require("./thumbnail");
const { sendThumbnailToSupabase } = require("./sendThumbnailToSupabase");

functions.http('thumbnail', async (req, res) => {
    corsMiddleware(req, res, async () => {
        try {

            let json = await prontuario(req);
   
            let pdfBuffer = await template_prescricao(json);

            let uuid = uuidv4();

            await thumbnail({
                filename: uuid,
                files: json.prontuarios.files,
                pdfBuffer: pdfBuffer
            }); 

            await sendThumbnailToSupabase({
                filename: uuid,
                files: json.prontuarios.files
            })

        } catch (error) {
            console.error('Erro ao converter PDF:', error);
            res.status(500).send('Erro ao converter PDF');
        }
    });
});
