const express = require('express');
const ejs = require('ejs');
const PDFDocument = require('pdfkit');
const table = require('pdfkit-table');
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); 
const pdfGeneratorRouter = require('./pdfGenerator');
const imagePath = path.join(__dirname, 'img/Membrete.jpg');
const app = express();
const connection = require('./db'); 



app.use('/generar', pdfGeneratorRouter);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000;


// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Rutas
app.get('/oficio', (req, res) => {
    res.render('oficio');
});

app.get('/', (req, res) => {
  res.render('index', { pdfs: null });
});


  // Rutas para registro 
  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/registro', (req, res) => {
    res.render('registro');
  });

  app.get('/maestros', (req, res) => {
    res.render('maestros');
  });
  
  app.get('/materias', (req, res) => {
    res.render('materias');
});
  
  app.get('/especialidad', (req, res) => {
    res.render('especialidad');
});
  
  app.get('/grupos', (req, res) => {
    res.render('grupos');
  });
  
  app.get('/oficio', (req, res) => {
    res.render('oficio');
});

  app.get('/asunto', (req, res) => {
  res.render('asunto');
});

app.get('/oficios', (req, res) => {
    // Renderizar la vista oficios.ejs
    res.render('oficios');
  });

// Obtener lista de maestros
app.get('/mostrar-maestros', (req, res) => {
    connection.query('SELECT nombre FROM maestros', (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de maestros:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(results);
    });
  });
// Borrar maestro por nombre
app.delete('/borrar-maestro/:nombre', (req, res) => {
    const nombreMaestro = req.params.nombre;

    // Query para borrar el maestro por nombre
    const sql = 'DELETE FROM maestros WHERE nombre = ?';

    connection.query(sql, [nombreMaestro], (err, result) => {
        if (err) {
            console.error('Error al borrar el maestro:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        console.log('Maestro borrado exitosamente.');
        res.status(200).send('Maestro borrado exitosamente.');
    });
});
//Agregar maestro por nombre
app.post('/agregar-maestro', (req, res) => {
    const { nombre } = req.body;

    // Verificar si el nombre del maestro ya existe en la base de datos
    connection.query('SELECT * FROM maestros WHERE nombre = ?', [nombre], (err, results) => {
        if (err) {
            console.error('Error al verificar si el maestro ya existe:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si el maestro ya existe, devolver un mensaje de error
        if (results.length > 0) {
            res.status(400).send('El maestro ya existe en la base de datos');
            return;
        }

        // Si el maestro no existe, proceder con la inserción
        const sql = 'INSERT INTO maestros (nombre) VALUES (?)';
        connection.query(sql, [nombre], (err, result) => {
            if (err) {
                console.error('Error al agregar el maestro:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Maestro agregado exitosamente.');
            res.status(200).send('Maestro agregado exitosamente.');
        });
    });
});

// Obtener lista de asuntos
app.get('/mostrar-asuntos', (req, res) => {
    connection.query('SELECT nombre FROM asuntos', (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de asuntos:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Extraer solo los nombres de los resultados
        const nombresAsuntos = results.map(result => result.nombre);
        res.json(nombresAsuntos);
    });
});

// Borrar asunto por nombre
app.delete('/borrar-asunto/:nombre', (req, res) => {
    const nombreAsunto = req.params.nombre;

    // Query para borrar el asunto por nombre
    const sql = 'DELETE FROM asuntos WHERE nombre = ?';

    connection.query(sql, [nombreAsunto], (err, result) => {
        if (err) {
            console.error('Error al borrar el asunto:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        console.log('Asunto borrado exitosamente.');
        res.status(200).send('Asunto borrado exitosamente.');
    });
});

// Agregar asunto por nombre
app.post('/agregar-asunto', (req, res) => {
    const { nombre } = req.body;

    // Verificar si el nombre del asunto ya existe en la base de datos
    connection.query('SELECT * FROM asuntos WHERE nombre = ?', [nombre], (err, results) => {
        if (err) {
            console.error('Error al verificar si el asunto ya existe:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si el asunto ya existe, devolver un mensaje de error
        if (results.length > 0) {
            res.status(400).send('El asunto ya existe en la base de datos');
            return;
        }

        // Si el asunto no existe, proceder con la inserción
        const sql = 'INSERT INTO asuntos (nombre) VALUES (?)';
        connection.query(sql, [nombre], (err, result) => {
            if (err) {
                console.error('Error al agregar el asunto:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Asunto agregado exitosamente.');
            res.status(200).send('Asunto agregado exitosamente.');
        });
    });
});

// Obtener lista de especialidades
app.get('/mostrar-especialidades', (req, res) => {
    connection.query('SELECT nombre FROM especialidades', (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de especialidades:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        const especialidades = results.map(especialidad => especialidad.nombre);
        res.json(especialidades);
    });
});

// Borrar especialidad por nombre
app.delete('/borrar-especialidad/:nombre', (req, res) => {
    const nombreEspecialidad = req.params.nombre;

    // Query para borrar la especialidad por nombre
    const sql = 'DELETE FROM especialidades WHERE nombre = ?';

    connection.query(sql, [nombreEspecialidad], (err, result) => {
        if (err) {
            console.error('Error al borrar la especialidad:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        console.log('Especialidad borrada exitosamente.');
        res.status(200).send('Especialidad borrada exitosamente.');
    });
});

// Agregar especialidad por nombre
app.post('/especialidades/agregar', (req, res) => {
    const { nombre } = req.body;

    // Verificar si el nombre de la especialidad ya existe en la base de datos
    connection.query('SELECT * FROM especialidades WHERE nombre = ?', [nombre], (err, results) => {
        if (err) {
            console.error('Error al verificar si la especialidad ya existe:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si la especialidad ya existe, devolver un mensaje de error
        if (results.length > 0) {
            res.status(400).send('La especialidad ya existe en la base de datos');
            return;
        }

        // Si la especialidad no existe, proceder con la inserción
        const sql = 'INSERT INTO especialidades (nombre) VALUES (?)';
        connection.query(sql, [nombre], (err, result) => {
            if (err) {
                console.error('Error al agregar la especialidad:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Especialidad agregada exitosamente.');
            res.status(200).send('Especialidad agregada exitosamente.');
        });
    });
});

// Obtener lista de grupos
app.get('/mostrar-grupos', (req, res) => {
    connection.query('SELECT nombre FROM grupos', (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de grupos:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        const grupos = results.map(grupo => grupo.nombre);
        res.json(grupos);
    });
});

// Borrar grupo por nombre
app.delete('/borrar-grupo/:nombre', (req, res) => {
    const nombreGrupo = req.params.nombre;

    // Query para borrar el grupo por nombre
    const sql = 'DELETE FROM grupos WHERE nombre = ?';

    connection.query(sql, [nombreGrupo], (err, result) => {
        if (err) {
            console.error('Error al borrar el grupo:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        console.log('Grupo borrado exitosamente.');
        res.status(200).send('Grupo borrado exitosamente.');
    });
});

// Agregar grupo por nombre
app.post('/grupos/agregar', (req, res) => {
    const { nombre } = req.body;

    // Verificar si el nombre del grupo ya existe en la base de datos
    connection.query('SELECT * FROM grupos WHERE nombre = ?', [nombre], (err, results) => {
        if (err) {
            console.error('Error al verificar si el grupo ya existe:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si el grupo ya existe, devolver un mensaje de error
        if (results.length > 0) {
            res.status(400).send('El grupo ya existe en la base de datos');
            return;
        }

        // Si el grupo no existe, proceder con la inserción
        const sql = 'INSERT INTO grupos (nombre) VALUES (?)';
        connection.query(sql, [nombre], (err, result) => {
            if (err) {
                console.error('Error al agregar el grupo:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Grupo agregado exitosamente.');
            res.status(200).send('Grupo agregado exitosamente.');
        });
    });
});

// Obtener lista de materias
app.get('/mostrar-materias', (req, res) => {
    connection.query('SELECT nombre FROM materias', (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de materias:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        const materias = results.map(materia => materia.nombre);
        res.json(materias);
    });
});

// Borrar materia por nombre
app.delete('/borrar-materia/:nombre', (req, res) => {
    const nombreMateria = req.params.nombre;

    // Query para borrar la materia por nombre
    const sql = 'DELETE FROM materias WHERE nombre = ?';

    connection.query(sql, [nombreMateria], (err, result) => {
        if (err) {
            console.error('Error al borrar la materia:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        console.log('Materia borrada exitosamente.');
        res.status(200).send('Materia borrada exitosamente.');
    });
});

// Agregar materia por nombre
app.post('/materias/agregar', (req, res) => {
    const { nombre } = req.body;

    // Verificar si el nombre de la materia ya existe en la base de datos
    connection.query('SELECT * FROM materias WHERE nombre = ?', [nombre], (err, results) => {
        if (err) {
            console.error('Error al verificar si la materia ya existe:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si la materia ya existe, devolver un mensaje de error
        if (results.length > 0) {
            res.status(400).send('La materia ya existe en la base de datos');
            return;
        }

        // Si la materia no existe, proceder con la inserción
        const sql = 'INSERT INTO materias (nombre) VALUES (?)';
        connection.query(sql, [nombre], (err, result) => {
            if (err) {
                console.error('Error al agregar la materia:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Materia agregada exitosamente.');
            res.status(200).send('Materia agregada exitosamente.');
        });
    });
});

// Obtener lista de usuarios
app.get('/mostrar-usuarios', (req, res) => {
    connection.query('SELECT usuario FROM users', (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de usuarios:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        const usuario = results.map(usuario => usuario.usuario);
        res.json(usuario);
    });
});

// Borrar usuario por nombre
app.post('/borrar-usuarios', (req, res) => {
    const nombreUsuario = req.body.nombre;

    // Query para borrar el usuario por nombre
    const sql = 'DELETE FROM users WHERE usuario = ?';

    connection.query(sql, [nombreUsuario], (err, result) => {
        if (err) {
            console.error('Error al borrar el usuario:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        console.log('Usuario borrado exitosamente.');
        res.status(200).send('Usuario borrado exitosamente.');
    });
});

// Agregar usuario por nombre
app.post('/registrar-usuario', (req, res) => {
    const { usuario, contraseña } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    connection.query('SELECT * FROM users WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            console.error('Error al verificar si el usuario ya existe:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si el usuario ya existe, devolver un mensaje de error
        if (results.length > 0) {
            res.status(400).send('El usuario ya existe en la base de datos');
            return;
        }

        // Si el usuario no existe, proceder con la inserción
        const sql = 'INSERT INTO users (usuario, contraseña) VALUES (?, ?)';
        connection.query(sql, [usuario, contraseña], (err, result) => {
            if (err) {
                console.error('Error al agregar el usuario:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            console.log('Usuario agregado exitosamente.');
            res.status(200).send('Usuario agregado exitosamente.');
        });
    });
});

app.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    // Consultar la base de datos para verificar si el usuario existe y si la contraseña es correcta
    connection.query('SELECT * FROM users WHERE usuario = ? AND contraseña = ?', [usuario, contraseña], (err, results) => {
        if (err) {
            console.error('Error al verificar el inicio de sesión:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si no se encuentra ningún usuario con las credenciales proporcionadas, enviar un mensaje de error
        if (results.length === 0) {
            res.status(401).send('Nombre de usuario o contraseña incorrectos');
            return;
        }

        // Si se encuentra un usuario con las credenciales proporcionadas, redirigir al usuario a la página de inicio
        res.redirect('/');
    });
});


// Generar PDF y guardar en la base de datos
app.post('/generate-pdf', (req, res) => {
    const data = req.body;

    // Obtener el último ID de oficio de la base de datos
    connection.query('SELECT MAX(id) AS ultimo_id FROM pdf_data', (err, rows) => {
        if (err) {
            console.error('Error al obtener el último ID de oficio:', err);
            return res.status(500).send('Error interno del servidor');
        }

        // Obtener el último ID de oficio y agregar 1 para el nuevo oficio
        const ultimoId = rows[0].ultimo_id || 0;
        const nuevoId = ultimoId + 1;

        // Función para agregar la imagen en el pie de página
        function agregarImagenEnPieDePagina(pdf) {
            const imagenPath = path.join(__dirname, 'img/Membrete-bj.jpg');
            const imagenAncho = 550;
            const imagenAlto = 100;
            const margen = 20;
          
            const paginas = pdf.bufferedPageRange().count;
          
            for (let i = 0; i < paginas; i++) { // Definir la variable i aquí
                pdf.switchToPage(i);
                pdf.image(imagenPath, margen, pdf.page.height - margen - imagenAlto, {
                    width: imagenAncho,
                    height: imagenAlto
                });
            }
        }


        // Función para construir el contenido del PDF
        function construirContenidoPDF(doc) {
            doc.image(imagePath, {
                fit: [350, 350], 
                align: 'center',
            });
            doc.moveDown(4);

            doc.font('Helvetica-Bold').fontSize(12).text(`ÁREA: SERVICIOS DOCENTES \n OFICIO No. 220 (CE-148)${nuevoId}/2024`, {
                align: 'right'
            });
            doc.text(`ASUNTO: ${data.asunto}`,{
                align: 'right'
            });
            doc.text(`Durango, Dgo. ${fechaEscrita(data.fecha)}`,{
                align: 'right'
            });
            doc.moveDown(2);
            doc.text(`${data.maestro} \nDOCENTE DEL PLANTEL`);
            doc.moveDown(4);
            doc.font('Helvetica').text(`${data.texto}`);
            doc.moveDown(2);

            doc.moveDown(15);
            doc.font('Helvetica-Bold').fontSize(12)
                .text('ATENTAMENTE.', 70, 480)
                .text('M.T.I. JOEL VÀZQUEZ RÌOS', 70, 580)
                .text('JEFE DEL DEPARTAMENTO', 70, 595)    
                .text('DE SERVICIOS DOCENTES', 70, 610);
                doc.moveDown(2);

                doc.font('Helvetica-Bold').fontSize(6).text(`C.c.p -interesado \n C.c.p. Archivo \n JVR/damg`);


            agregarImagenEnPieDePagina(doc);

            doc.end();

            function fechaEscrita(fecha) {
                const meses = [
                    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                ];
                
                const partesFecha = fecha.split('-');
                const dia = partesFecha[2];
                const mesNum = parseInt(partesFecha[1]) - 1;
                const mes = meses[mesNum];
                const año = partesFecha[0];
                
                return `${dia} de ${mes} de ${año}`;
            }
        }

        if (req.query.doc) {
            
            // Generar el documento DOC
            const doc = new Docxtemplater();
            const content = fs.readFileSync(path.resolve(__dirname, 'plantilla.docx'), 'binary');
            doc.loadZip(content);

            // Reemplazar los marcadores de posición en la plantilla con los datos proporcionados
            doc.setData({
                asunto: data.asunto,
                maestro: data.maestro,
                especialidad: data.especialidad,
                materia: data.materia,
                grupo: data.grupo,
                fecha: fechaEscrita(data.fecha),
                texto: data.texto
            });

            try {
                doc.render();
                const buf = doc.getZip().generate({ type: 'nodebuffer' });

                // Guardar el DOC en la base de datos
                const sql = 'INSERT INTO pdf_data (asunto, maestro, especialidad, materia, grupo, fecha, texto, pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                const values = [data.asunto, data.maestro, data.especialidad, data.materia, data.grupo, data.fecha, data.texto, buf];

                connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error('Error al guardar el DOC en la base de datos:', err);
                        return res.status(500).send('Error interno del servidor');
                    }

                    console.log('DOC guardado en la base de datos.');
                    res.set({
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'Content-Length': buf.length,
                        'Content-Disposition': 'attachment; filename="oficio.docx"'
                    });
                    res.send(buf);
                });
            } catch (error) {
                console.error('Error al renderizar el DOC:', error);
                res.status(500).send('Error interno del servidor');
            }
        } else {
            // Generar el PDF
            const pdf = new PDFDocument();
            let buffers = [];
            pdf.on('data', buffers.push.bind(buffers));
            pdf.on('end', () => {
                const pdfData = Buffer.concat(buffers);

                // Guardar el PDF en la base de datos
                const sql = 'INSERT INTO pdf_data (asunto, maestro, especialidad, materia, grupo, fecha, texto, pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                const values = [data.asunto, data.maestro, data.especialidad, data.materia, data.grupo, data.fecha, data.texto, pdfData];

                connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error('Error al guardar el PDF en la base de datos:', err);
                        return res.status(500).send('Error interno del servidor');
                    }

                    console.log('PDF guardado en la base de datos.');
                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Length': pdfData.length,
                        'Content-Disposition': 'attachment; filename="oficio.pdf"'
                    });
                    res.send(pdfData);
                });
            });

            construirContenidoPDF(pdf);
        }
    });
});



// Obtener lista de maestros mediante AJAX
app.get('/maestro', (req, res) => {
  connection.query('SELECT * FROM maestros', (err, results) => {
      if (err) {
          console.error('Error al obtener la lista de maestros:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.json(results);
  });
});

// Obtener lista de asuntos
app.get('/asuntos', (req, res) => {
  connection.query('SELECT * FROM asuntos', (err, results) => {
      if (err) {
          console.error('Error al obtener la lista de asuntos:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.json(results);
  });
});


// Obtener lista de especialidades
app.get('/especialidades', (req, res) => {
  connection.query('SELECT * FROM especialidades', (err, results) => {
      if (err) {
          console.error('Error al obtener la lista de especialidades:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.json(results);
  });
});

// Obtener lista de materias
app.get('/materia', (req, res) => {
  connection.query('SELECT * FROM materias', (err, results) => {
      if (err) {
          console.error('Error al obtener la lista de materias:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.json(results);
  });
});

// Obtener lista de grupos
app.get('/grupo', (req, res) => {
  connection.query('SELECT * FROM grupos', (err, results) => {
      if (err) {
          console.error('Error al obtener la lista de grupos:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.json(results);
  });
});

// Ruta para procesar la búsqueda de PDFs
app.get('/search-pdf', (req, res) => {
  const { fecha, asunto, maestro } = req.query;

  // Construir la consulta SQL basada en los filtros proporcionados
  let sql = 'SELECT * FROM pdf_data WHERE 1=1';
  const params = [];

  if (fecha) {
      sql += ' AND fecha = ?';
      params.push(fecha);
  }
  if (asunto) {
      sql += ' AND asunto LIKE ?';
      params.push(`%${asunto}%`);
  }
  if (maestro) {
      sql += ' AND maestro LIKE ?';
      params.push(`%${maestro}%`);
  }

  // Ejecutar la consulta SQL
  connection.query(sql, params, (err, results) => {
      if (err) {
          console.error('Error al buscar PDFs en la base de datos:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      res.render('index', { pdfs: results });
  });
});

// Ruta para descargar un PDF específico
app.get('/download-pdf/:id', (req, res) => {
    const pdfId = req.params.id;

    // Consultar el PDF en la base de datos
    connection.query('SELECT * FROM pdf_data WHERE id = ?', [pdfId], (err, results) => {
        if (err) {
            console.error('Error al buscar el PDF en la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }

        // Si se encontró el PDF, enviarlo al cliente
        if (results.length > 0) {
            const pdfData = results[0].pdf;
            const pdfLength = pdfData.length;

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Length': pdfLength,
                'Content-Disposition': 'attachment; filename="oficio.pdf"'
            });
            res.end(pdfData); // Envía los datos binarios del PDF al cliente
        } else {
            res.status(404).send('PDF no encontrado');
        }
    });
});

app.use(pdfGeneratorRouter);



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
