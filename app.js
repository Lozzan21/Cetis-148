const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const pdfGeneratorRouter = require('./pdfGenerator');
const app = express();
const fs = require('fs');
const port = 3000;

app.use(express.static(__dirname + "/public"));
// Configurar el middleware para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));


// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cetis'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

// Middleware para analizar las solicitudes del cuerpo como JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');


  // Página principal
  app.get('/', (req, res) => {
    res.render('index');
  });

  // Rutas para registro 
  app.get('/login', (req, res) => {
    res.render('login');
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

// Ruta de registro de usuario
app.get('/registro', (req, res) => {
    res.render('registro', { registroExitoso: false });
  });
  
  app.post('/registro', (req, res) => {
    const { usuario, contraseña } = req.body;
    const usuarioNuevo = { usuario, contraseña };
    
    // Insertar el usuario en la base de datos
    db.query('INSERT INTO users SET ?', usuarioNuevo, (err, result) => {
      if (err) {
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Renderizar la vista de registro nuevamente con el mensaje de registro exitoso
      res.render('registro', { registroExitoso: true });
    });
  });

      // Insertar el maestro en la base de datos
  app.post('/maestros/agregar', (req, res) => {
    const { nombre } = req.body;

    db.query('INSERT INTO maestros (nombre) VALUES (?)', [nombre], (err, result) => {
        if (err) {
            res.status(500).send('Error al agregar el maestro');
            return;
        }
        res.send('<p>Maestro agregado correctamente</p>');
    });
});

app.post('/maestros/borrar', (req, res) => {
    const { nombre } = req.body;

    db.query('DELETE FROM maestros WHERE nombre = ?', [nombre], (err, result) => {
        if (err) {
            res.status(500).send('Error al borrar el maestro');
            return;
        }
        res.send('<p>Maestro borrado correctamente</p>');
    });
});

app.get('/mostrar-maestros', (req, res) => {
    db.query('SELECT * FROM maestros', (err, result) => {
        if (err) {
            res.status(500).send('Error al obtener los maestros');
            return;
        }
        let listaMaestros = '<h2>Maestros Registrados</h2><ul>';
        result.forEach(maestro => {
            listaMaestros += `<li>${maestro.nombre}</li>`;
        });
        listaMaestros += '</ul>';
        res.send(listaMaestros);
    });
});

// Insertar la materia en la base de datos
app.post('/materias/agregar', (req, res) => {
  const { nombre } = req.body;

  db.query('INSERT INTO materias (nombre) VALUES (?)', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al agregar la materia');
          return;
      }
      res.send('<p>Materia agregada correctamente</p>');
  });
});

// Borrar la materia de la base de datos
app.post('/materias/borrar', (req, res) => {
  const { nombre } = req.body;

  db.query('DELETE FROM materias WHERE nombre = ?', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al borrar la materia');
          return;
      }
      res.send('<p>Materia borrada correctamente</p>');
  });
});

// Obtener y mostrar todas las materias
app.get('/mostrar-materias', (req, res) => {
  db.query('SELECT * FROM materias', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener las materias');
          return;
      }
      let listaMaterias = '<h2>Materias Registradas</h2><ul>';
      result.forEach(materia => {
          listaMaterias += `<li>${materia.nombre}</li>`;
      });
      listaMaterias += '</ul>';
      res.send(listaMaterias);
  });
});

// Insertar la especialidad en la base de datos
app.post('/especialidades/agregar', (req, res) => {
  const { nombre } = req.body;

  db.query('INSERT INTO especialidades (nombre) VALUES (?)', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al agregar la especialidad');
          return;
      }
      res.send('<p>Especialidad agregada correctamente</p>');
  });
});

// Borrar la especialidad de la base de datos
app.post('/especialidades/borrar', (req, res) => {
  const { nombre } = req.body;

  db.query('DELETE FROM especialidades WHERE nombre = ?', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al borrar la especialidad');
          return;
      }
      res.send('<p>Especialidad borrada correctamente</p>');
  });
});

// Obtener y mostrar todas las especialidades
app.get('/mostrar-especialidades', (req, res) => {
  db.query('SELECT * FROM especialidades', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener las especialidades');
          return;
      }
      let listaEspecialidades = '<h2>Especialidades Registradas</h2><ul>';
      result.forEach(especialidad => {
          listaEspecialidades += `<li>${especialidad.nombre}</li>`;
      });
      listaEspecialidades += '</ul>';
      res.send(listaEspecialidades);
  });
});

// Insertar el grupo en la base de datos
app.post('/grupos/agregar', (req, res) => {
  const { nombre } = req.body;

  db.query('INSERT INTO grupos (nombre) VALUES (?)', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al agregar el grupo');
          return;
      }
      res.send('<p>Grupo agregado correctamente</p>');
  });
});

// Borrar el grupo de la base de datos
app.post('/grupos/borrar', (req, res) => {
  const { nombre } = req.body;

  db.query('DELETE FROM grupos WHERE nombre = ?', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al borrar el grupo');
          return;
      }
      res.send('<p>Grupo borrado correctamente</p>');
  });
});

// Obtener y mostrar todos los grupos
app.get('/mostrar-grupos', (req, res) => {
  db.query('SELECT * FROM grupos', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener los grupos');
          return;
      }
      let listaGrupos = '<h2>Grupos Registrados</h2><ul>';
      result.forEach(grupo => {
          listaGrupos += `<li>${grupo.nombre}</li>`;
      });
      listaGrupos += '</ul>';
      res.send(listaGrupos);
  });
});

// Insertar el asunto en la base de datos
app.post('/asuntos/agregar', (req, res) => {
  const { nombre } = req.body;

  db.query('INSERT INTO asuntos (nombre) VALUES (?)', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al agregar el asunto');
          return;
      }
      res.send('<p>Asunto agregado correctamente</p>');
  });
});

// Borrar el asuntos de la base de datos
app.post('/asuntos/borrar', (req, res) => {
  const { nombre } = req.body;

  db.query('DELETE FROM asuntos WHERE nombre = ?', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al borrar el asunto');
          return;
      }
      res.send('<p>Asunto borrado correctamente</p>');
  });
});

// Obtener y mostrar todos los asuntos
app.get('/mostrar-asuntos', (req, res) => {
  db.query('SELECT * FROM asuntos', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener los asuntos');
          return;
      }
      let listaAsuntos = '<h2>Asuntos Registrados</h2><ul>';
      result.forEach(asunto => {
          listaAsuntos += `<li>${asunto.nombre}</li>`;
      });
      listaAsuntos += '</ul>';
      res.send(listaAsuntos);
  });
});

// Borrar usuario de la base de datos
app.post('/usuarios/borrar', (req, res) => {
  const { nombre } = req.body;

  db.query('DELETE FROM users WHERE usuario = ?', [nombre], (err, result) => {
      if (err) {
          res.status(500).send('Error al borrar el usuario');
          return;
      }
      res.send('<p>Usuario borrado correctamente</p>');
  });
});

// Obtener y mostrar todos los usuarios
app.get('/mostrar-usuarios', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener los usuarios');
          return;
      }
      let listaUsuarios = '<h2></h2><ul>';
      result.forEach(usuario => {
          listaUsuarios += `<li>${usuario.usuario}</li>`; // Suponiendo que cada usuario tiene un campo 'nombre'
      });
      listaUsuarios += '</ul>';
      res.send(listaUsuarios);
  });
});

app.get('/oficios', (req, res) => {
  // Renderizar la vista oficios.ejs
  res.render('oficios');
});

  app.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;
  
    // Consultar si el usuario existe en la base de datos
    db.query('SELECT * FROM users WHERE usuario = ? AND contraseña = ?', [usuario, contraseña], (err, result) => {
      if (err) {
        res.status(500).send('Error al iniciar sesión');
        return;
      }
      if (result.length > 0) {
        // Inicio de sesión exitoso, redirigir al usuario a la página de inicio
        res.redirect('/');
      } else {
        res.status(401).send('Usuario o contraseña incorrectos');
      }
    });
  });

// Usar el enrutador pdfGeneratorRouter en la aplicación principal
app.use(pdfGeneratorRouter);

// Ruta para obtener los maestros desde la base de datos
app.get('/obtener-asuntos', (req, res) => {
  db.query('SELECT nombre FROM asuntos', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener los maestros');
          return;
      }
      res.json(result); // Enviar la lista de maestros como respuesta JSON
  });
});

// Ruta para obtener los maestros desde la base de datos
app.get('/obtener-maestros', (req, res) => {
  db.query('SELECT nombre FROM maestros', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener los maestros');
          return;
      }
      res.json(result); // Enviar la lista de maestros como respuesta JSON
  });
});

// Ruta para obtener las materias desde la base de datos
app.get('/obtener-materias', (req, res) => {
  db.query('SELECT nombre FROM materias', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener las materias');
          return;
      }
      res.json(result); // Enviar la lista de materias como respuesta JSON
  });
});

// Ruta para obtener la especialidad desde la base de datos
app.get('/obtener-especialidades', (req, res) => {
  db.query('SELECT nombre FROM especialidades', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener las especialidades');
          return;
      }
      res.json(result); // Enviar la lista de especialidades como respuesta JSON
  });
});

// Ruta para obtener el grupo desde la base de datos
app.get('/obtener-grupos', (req, res) => {
  db.query('SELECT nombre FROM grupos', (err, result) => {
      if (err) {
          res.status(500).send('Error al obtener los grupos');
          return;
      }
      res.json(result); // Enviar la lista de grupos como respuesta JSON
  });
});

app.post('/generar-y-guardar-pdf', async (req, res) => {
  try {
    // Capturar el contenido del PDF enviado desde el formulario
    const pdfContent = req.body.pdfContent;

    // Convertir el PDF en un objeto Buffer
    const pdfBuffer = Buffer.from(pdfContent, 'base64');

    // Guardar el PDF en la base de datos
    const sql = 'INSERT INTO pdfs (pdf_blob) VALUES (?)';
    db.query(sql, [pdfBuffer], (err, result) => {
      if (err) {
        console.error('Error al insertar el PDF en la base de datos:', err);
        res.status(500).send('Error interno del servidor al guardar el PDF en la base de datos');
        return;
      }
      console.log('PDF guardado en la base de datos');
      res.send('PDF guardado correctamente en la base de datos');
    });
  } catch (error) {
    console.error('Error al guardar el PDF en la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
