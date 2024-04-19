const express = require('express');
const PDFDocument = require('pdfkit-table');
const fs = require('fs'); // Importar el módulo fs
const router = express.Router();
const connection = require('./db'); 

// Ruta para generar el PDF
router.post('/generar', async (req, res) => {
    try {
        const fecha = new Date(req.body.fecha);
        const doc = new PDFDocument();
        fecha.setDate(fecha.getDate() + 1);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-MX', options);

        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        const imgPath = 'img/Membrete.jpg';
        if (fs.existsSync(imgPath)) {
            doc.image(imgPath, {
                fit: [250, 250],
                align: 'center',
                y: 50
            });
            doc.moveDown(2); 
        }

        doc.font('Helvetica-Bold').fontSize(12).text(`ÁREA: SERVICIOS DOCENTES \n OFICIO No. 220 (CE-148)${req.body.numero}/2024`, {
            align: 'right'
        });
        doc.fontSize(12).text(`ASUNTO: ${req.body.asunto}`,{
            align: 'right'
        });

        doc.fontSize(12).text(`Durango, Dgo., ${fechaFormateada}`,{
            align: 'right'});

        doc.moveDown(2);
        doc.fontSize(12).text(`${req.body.maestro} \nDOCENTE DEL PLANTEL`);
        doc.moveDown(4);
        doc.fontSize(12).text(`${req.body.texto}`);
        doc.moveDown(2);
        if (req.body.numRows && req.body.numCols) {
            const numRows = parseInt(req.body.numRows) || 3;
            const numCols = parseInt(req.body.numCols) || 3;
            const columnTitles = [];
            for (let j = 0; j < numCols; j++) {
                const tituloColumna = req.body[`titulo_columna_${j}`] || `Columna ${j + 1}`;
                columnTitles.push(tituloColumna);
            }
            const tableContent = [];
            for (let i = 0; i < numRows; i++) {
                const row = [];
                for (let j = 0; j < numCols; j++) {
                    const cellContent = req.body[`contenido_${i}_${j}`] || '';
                    row.push(cellContent);
                }
                tableContent.push(row);
            }
        
            const table = {
                headers: columnTitles,
                rows: tableContent,
            };
        
            // Convertir la tabla en formato de texto (JSON)
            const tablaPDF = JSON.stringify(table);
        
            // Agregar la tabla al objeto de datos para la base de datos
            req.body.tabla_pdf = tablaPDF;
        
            await doc.table(table, {
                prepareHeader: () => doc.font('Helvetica-Bold').fill('black'),
                prepareRow: () => doc.font('Helvetica').fill('black'),
                drawHorizontalLine: (row, y) => row > 0,
                drawVerticalLine: (column, x) => column > 0,
            });
        }
        
        doc.moveDown(15);
        doc.font('Helvetica-Bold').fontSize(12)
            .text('ATENTAMENTE.', 70, 480)
            .text('M.T.I. JOEL VÀZQUEZ RÌOS', 70, 580)
            .text('JEFE DEL DEPARTAMENTO', 70, 595)    
            .text('DE SERVICIOS DOCENTES', 70, 610);   
        
        const alturaPagina = doc.page.height;
        const posicionPieDePaginaY = alturaPagina - 100; 
        doc.image('img/Membrete-bj.jpg', { x: 0, y: posicionPieDePaginaY, width: 550, height: 70 });
        
        // Finalizar y enviar el documento PDF
        doc.end();
        
        const pdfData = await new Promise((resolve, reject) => {
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
            doc.on('error', reject);
        });
        
        // Guardar el PDF y la tabla en la base de datos
        const sql = 'INSERT INTO pdf_data (asunto, maestro, especialidad, materia, grupo, fecha, texto, pdf, tabla_pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [req.body.asunto, req.body.maestro, req.body.especialidad, req.body.materia, req.body.grupo, req.body.fecha, req.body.texto, pdfData, req.body.tabla_pdf];
        
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al guardar el PDF en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            console.log('PDF guardado en la base de datos.');
            

        });
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;