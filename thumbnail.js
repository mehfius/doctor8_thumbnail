const fs = require('fs');
const { pdfToPng } = require('pdf-to-png-converter');
const sharp = require('sharp');

const thumbnail = async function (json) {

    const tempFilePath = './temp/temp.pdf';
    const outputFileName = json.filename; // Nome do arquivo de saída sem "page"

    fs.writeFileSync(tempFilePath, json.pdfBuffer);

    try {

        const pngPages = await pdfToPng(tempFilePath, {
            outputFolder: './temp/', // Salva no diretório temporário
            outputFileMask: outputFileName, // Usa outputFileMask para controlar o nome do arquivo
            pagesToProcess: [1]
        });

        console.log('Conversão de PDF para imagem concluída.');

        sharp('./temp/'+json.filename+'_page_1.png')
        .toFormat('jpeg')
        .toFile('./temp/'+json.filename+'.jpg')
        .then(() => {
            console.log('Conversão concluída com sucesso!');
        })
        .catch(err => {
            console.error('Erro durante a conversão:', err);
        });
    } catch (err) {
        
        console.error('Erro ao converter PDF para imagem:', err);   
    
    } finally {
     
    }
};

module.exports = { thumbnail };