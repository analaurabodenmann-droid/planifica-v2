import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function App() {
  const [materia, setMateria] = useState('');
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('Secundario');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);

  const generarPlanificacion = async (e) => {
    e.preventDefault();
    if (!materia || !tema) return;

    setCargando(true);
    setResultado('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Actúa como un experto pedagogo. Diseña una propuesta de planificación didáctica para:
- Materia/Asignatura: ${materia}
- Tema: ${tema}
- Nivel Educativo: ${nivel}

Incluye:
1. Objetivos de aprendizaje
2. Estructura de la clase (Inicio, Desarrollo, Cierre con tiempos)
3. Actividad práctica sugerida
4. Criterios de evaluación`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      setResultado(text);
    } catch (error) {
      console.error("Error al generar:", error);
      setResultado("Ocurrió un error al conectar con Gemini. Verifica que VITE_GEMINI_API_KEY esté configurada correctamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Planifica: Asistente Docente</h1>
      <form onSubmit={generarPlanificacion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Materia: </label>
          <input
            type="text"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div>
          <label>Tema: </label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div>
          <label>Nivel: </label>
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="Primario">Primario</option>
            <option value="Secundario">Secundario</option>
            <option value="Terciario / Universitario">Terciario / Universitario</option>
          </select>
        </div>
        <button type="submit" disabled={cargando} style={{ padding: '10px', marginTop: '10px', cursor: 'pointer' }}>
          {cargando ? 'Generando propuesta...' : 'Generar Planificación'}
        </button>
      </form>
      {resultado && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', whitespace: 'pre-wrap' }}>
          <h3>Resultado:</h3>
          {resultado}
        </div>
      )}
    </div>
  );
}
