import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse(
  await readFile(new URL('../iaprende-1415d-firebase-adminsdk-fbsvc-7e1292683c.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function populate() {
  console.log('--- Reseteando y cargando datos premium ---');

  const batch = db.batch();

  // 1. Usuarios
  const users = [
    {
      id: 'admin-1',
      nombre: 'Osiel',
      apellido: 'Perales',
      email: 'admin@iaprende.com',
      rol: 'admin',
      fecha_registro: new Date().toISOString()
    },
    {
      id: 'maestro-1',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      email: 'carlos@iaprende.com',
      rol: 'maestro',
      fecha_registro: new Date().toISOString()
    },
    {
      id: 'alumno-1',
      nombre: 'Ana',
      apellido: 'Sosa',
      email: 'ana@iaprende.com',
      rol: 'alumno',
      fecha_registro: new Date().toISOString()
    }
  ];

  users.forEach(u => {
    const ref = db.collection('usuarios').doc(u.id);
    batch.set(ref, u);
  });

  // 2. Cursos
  const cursos = [
    {
      id: 'curso-1',
      titulo: 'Diseño Humanista en UI',
      descripcion: 'Aprende a crear interfaces que pongan al humano en el centro.',
      maestro_id: 'maestro-1',
      publicado: true,
      fecha_creacion: new Date().toISOString()
    }
  ];

  cursos.forEach(c => {
    const ref = db.collection('cursos').doc(c.id);
    batch.set(ref, c);
  });

  // 3. Bloques
  const bloques = [
    {
      id: 'bloque-1',
      curso_id: 'curso-1',
      tipo: 'texto',
      orden: 1,
      contenido: {
        titulo: 'Introducción',
        html: '<h1>Bienvenido al Diseño Humanista</h1><p>El diseño no se trata solo de colores, sino de personas.</p>'
      }
    },
    {
      id: 'bloque-2',
      curso_id: 'curso-1',
      tipo: 'cuestionario',
      orden: 2,
      contenido: {
        titulo: 'Quiz Inicial',
        preguntas: [
          { id: 'p1', texto: '¿Qué es lo más importante en el diseño?', tipo: 'opcion_multiple', opciones: ['Colores', 'Personas', 'Código'], correcta: 1, puntos: 10 }
        ]
      }
    }
  ];

  bloques.forEach(b => {
    const ref = db.collection('bloques').doc(b.id);
    batch.set(ref, b);
  });

  // 4. Grupos
  const grupos = [
    {
      id: 'grupo-1',
      nombre: 'Generación 2026-A',
      descripcion: 'Grupo avanzado de diseño interactivo.',
      maestro_id: 'maestro-1'
    }
  ];

  grupos.forEach(g => {
    const ref = db.collection('grupos').doc(g.id);
    batch.set(ref, g);
  });

  // 5. Asignaciones (Grupo-Alumno)
  const ga = [
    { id: 'ga-1', grupo_id: 'grupo-1', alumno_id: 'alumno-1' }
  ];

  ga.forEach(item => {
    const ref = db.collection('grupoAlumnos').doc(item.id);
    batch.set(ref, item);
  });

  await batch.commit();
  console.log('--- Datos cargados con éxito! ---');
}

populate().catch(console.error);
