const PdfPrinter = require('pdfmake');
const path = require('path');

const template_prescricao = async function (json) {

    const fontsPath = path.join(__dirname, 'src/fonts/Roboto/');
    var options = {};
    var fonts = {
        Roboto: {
            normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
            bold: path.join(fontsPath, 'Roboto-Medium.ttf'),
            italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
            bolditalics: path.join(fontsPath, 'Roboto-MediumItalic.ttf')
        }
    };

    let medico = json.medico;
    let paciente = json.paciente;
    let prontuarios = json.prontuarios;
    var prescription = {

        pageSize: 'A4',

        pageOrientation: 'portrait',

        pageMargins: [ 40, 60, 40, 60 ],
        info: {
            "2.16.76.1.4.2.2.2": medico.crm_estado,
            "2.16.76.1.4.2.2.1": medico.crm,
            "2.16.76.1.4.2.2": "CRM",
            "2.16.76.1.12.1.1": "Prescrição de medicamento"
        },
        content: [
            {
                columns: [
                    {
                        width: '*',
                        text: [
                            {
                                text:"Prescrição de medicamento\n\n",
                            },
                            'Paciente:\n' + paciente.nome + '\n',
                            '\nCPF:\n' + paciente.cpf + '\n',
                            '\nEndereço:\n' + paciente.address
                        ]

                    }
                ]
            },
            {
                canvas: [ 
                    {
                        type: 'line',
                        x1: 0, y1: 5,
                        x2: 515.28, y2: 5,
                        lineWidth: 0.1
                    }
                ],
            },
            {
                text: 'Prescrição: \n\n',
                margin: [0, 20, 0, 0],
            },
            {
                text: prontuarios.text,
            },

        ]        
        
    };
    var options = {};
    var printer = new PdfPrinter(fonts);
    const pdfBuffer = await new Promise((resolve, reject) => {
        const pdfDoc = printer.createPdfKitDocument(prescription, options);
        let chunks = [];
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
        pdfDoc.end();
    });

    console.log('[prescricao.js] Tipo de fileBuffer:', typeof pdfBuffer);

    return pdfBuffer;

};

module.exports = { template_prescricao };
