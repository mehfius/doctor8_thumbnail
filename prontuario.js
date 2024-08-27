const { createClient } = require("@supabase/supabase-js");

const prontuario = async function (req) {
        
    const supabase = createClient(process.env.URL, process.env.KEY);

    let param = {
        data: {
            id: req.body.data.id,
            session: req.body.data.session,
            psc: req.body.data.psc
        }
    };
 
    let { data, error } = await supabase.rpc('sign_pdf', param);

    return data;
    
};

module.exports = { prontuario };
