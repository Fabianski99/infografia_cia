import React, { useState, useEffect } from 'react';

// --- DATOS DE LA INFOGRAFÍA ---
const triadData = {
  confidencialidad: {
    id: 'confidencialidad',
    title: 'Confidencialidad',
    color: '#3b82f6', // Blue
    icon: '🔒',
    definition: 'Garantizar que la información solo sea accesible para las personas autorizadas.',
    mechanisms: ['Cifrado de datos', 'Contraseñas seguras', 'Autenticación de 2 factores (2FA)', 'Biometría'],
    question: '¿Alguien que no debería, puede ver esto?',
    breach: 'Filtración de contraseñas, robo de bases de datos de clientes, espionaje corporativo.'
  },
  integridad: {
    id: 'integridad',
    title: 'Integridad',
    color: '#10b981', // Emerald
    icon: '🛡️',
    definition: 'Asegurar que la información sea precisa y no haya sido alterada de forma no autorizada.',
    mechanisms: ['Funciones Hash', 'Copias de seguridad', 'Control de versiones', 'Registros de auditoría'],
    question: '¿La información es correcta y confiable?',
    breach: 'Alteración de un historial médico, cambio del monto en una transferencia bancaria.'
  },
  disponibilidad: {
    id: 'disponibilidad',
    title: 'Disponibilidad',
    color: '#f59e0b', // Amber
    icon: '⚡',
    definition: 'Garantizar que los sistemas y los datos estén disponibles cuando se necesiten.',
    mechanisms: ['Redundancia de servidores', 'Protección Anti-DDoS', 'Mantenimiento preventivo', 'Planes de contingencia'],
    question: '¿Puedo acceder al sistema en este momento?',
    breach: 'Caída de los servidores de un banco, ataque de Ransomware que bloquea los equipos.'
  }
};

const scenarios = [
  { text: "Un hacker bloquea los servidores de un hospital pidiendo un rescate para reactivarlos.", answer: "disponibilidad" },
  { text: "Un empleado intercepta un correo y lee el salario de todos los directivos de la empresa.", answer: "confidencialidad" },
  { text: "Un estudiante altera la base de datos de la universidad para cambiar su calificación de 4 a 7.", answer: "integridad" }
];

// --- COMPONENTES ---

function TriadCard({ pillar, isActive, onClick }) {
  return (
    <div 
      className={`triad-card ${isActive ? 'active' : ''}`} 
      onClick={onClick}
      style={{ '--accent-color': pillar.color }}
    >
      <div className="card-header">
        <span className="card-icon">{pillar.icon}</span>
        <h2>{pillar.title}</h2>
      </div>
      <div className="card-content">
        <p className="card-definition">{pillar.definition}</p>
        
        <div className="card-details">
          <div className="detail-group">
            <h3>Pregunta clave</h3>
            <p className="question-text">"{pillar.question}"</p>
          </div>
          
          <div className="detail-group">
            <h3>Mecanismos de defensa</h3>
            <ul className="mechanism-list">
              {pillar.mechanisms.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-group alert-group">
            <h3>Ejemplo de fallo</h3>
            <p>{pillar.breach}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioTester() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleGuess = (guess) => {
    const isCorrect = guess === scenarios[currentScenario].answer;
    setFeedback({ isCorrect, guess });
    
    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        setCurrentScenario((prev) => (prev + 1) % scenarios.length);
      }, 2000);
    }
  };

  return (
    <div className="scenario-tester">
      <div className="tester-header">
        <span className="eyebrow">PONLO A PRUEBA</span>
        <h2>¿Qué pilar se está rompiendo?</h2>
      </div>
      
      <div className="scenario-box">
        <span className="scenario-number">Caso {currentScenario + 1} de {scenarios.length}</span>
        <p className="scenario-text">"{scenarios[currentScenario].text}"</p>
      </div>

      <div className="tester-buttons">
        {Object.values(triadData).map((pillar) => (
          <button 
            key={pillar.id}
            onClick={() => handleGuess(pillar.id)}
            className={`test-btn ${feedback?.guess === pillar.id ? (feedback.isCorrect ? 'correct' : 'incorrect') : ''}`}
            style={{ '--btn-color': pillar.color }}
            disabled={feedback?.isCorrect}
          >
            {pillar.title}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.isCorrect ? 'success' : 'error'}`}>
          {feedback.isCorrect 
            ? '¡Correcto! Has identificado el pilar vulnerado. Cargando siguiente...' 
            : 'Incorrecto. Piénsalo bien, ¿qué es exactamente lo que se vio afectado?'}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activePillar, setActivePillar] = useState(null);

  // Efecto para animaciones iniciales
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#0f172a';
    document.body.style.color = '#f8fafc';
    document.body.style.fontFamily = "'Inter', 'Segoe UI', system-ui, sans-serif";
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg-color: #0f172a;
          --surface-color: #1e293b;
          --surface-hover: #334155;
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --border-color: #334155;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .infographic-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        /* --- HERO SECTION --- */
        .hero {
          text-align: center;
          margin-bottom: 80px;
          animation: fadeInDown 0.8s ease-out;
        }

        .hero .eyebrow {
          display: inline-block;
          color: #38bdf8;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          padding: 6px 12px;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 20px;
        }

        .hero h1 {
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* --- TRIAD CARDS SECTION --- */
        .triad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 80px;
        }

        .triad-card {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .triad-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--accent-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .triad-card:hover, .triad-card.active {
          transform: translateY(-8px);
          border-color: var(--accent-color);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }

        .triad-card:hover::before, .triad-card.active::before {
          transform: scaleX(1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .card-icon {
          font-size: 32px;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          color: var(--accent-color);
        }

        .triad-card h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--accent-color);
        }

        .card-definition {
          font-size: 15px;
          color: var(--text-primary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .card-details {
          display: grid;
          gap: 20px;
          opacity: 0.8;
          transition: opacity 0.3s;
        }

        .triad-card:hover .card-details, .triad-card.active .card-details {
          opacity: 1;
        }

        .detail-group h3 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .question-text {
          font-size: 16px;
          font-style: italic;
          color: #e2e8f0;
          border-left: 3px solid var(--accent-color);
          padding-left: 12px;
        }

        .mechanism-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mechanism-list li {
          background: rgba(255,255,255,0.05);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .alert-group {
          margin-top: 8px;
          padding: 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
        }

        .alert-group p {
          color: #fca5a5;
          font-size: 14px;
          margin: 0;
        }

        /* --- TESTER SECTION --- */
        .scenario-tester {
          background: var(--surface-color);
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid var(--border-color);
        }

        .tester-header .eyebrow {
          color: #a855f7;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 8px;
        }

        .tester-header h2 {
          font-size: 32px;
          margin-bottom: 32px;
        }

        .scenario-box {
          background: var(--bg-color);
          padding: 32px;
          border-radius: 12px;
          margin-bottom: 32px;
        }

        .scenario-number {
          display: block;
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 12px;
        }

        .scenario-text {
          font-size: 20px;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .tester-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .test-btn {
          background: transparent;
          border: 2px solid var(--border-color);
          color: var(--text-primary);
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .test-btn:hover:not(:disabled) {
          border-color: var(--btn-color);
          background: rgba(255,255,255,0.05);
        }

        .test-btn.correct {
          background: var(--btn-color);
          border-color: var(--btn-color);
          color: #000;
        }

        .test-btn.incorrect {
          opacity: 0.5;
          border-color: #ef4444;
          text-decoration: line-through;
        }

        .feedback-msg {
          margin-top: 24px;
          padding: 12px;
          border-radius: 8px;
          font-weight: 500;
          animation: fadeIn 0.3s ease;
        }

        .feedback-msg.success { color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .feedback-msg.error { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

        /* --- FOOTER --- */
        .site-footer {
          text-align: center;
          margin-top: 80px;
          padding-top: 32px;
          border-top: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 14px;
        }

        /* --- ANIMATIONS --- */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
          .infographic-container { padding: 40px 16px; }
          .hero h1 { font-size: 32px; }
          .scenario-tester { padding: 24px; }
          .scenario-text { font-size: 18px; }
          .test-btn { width: 100%; }
        }
      `}</style>

      <main className="infographic-container">
        
        {/* Sección Hero */}
        <header className="hero">
          <span className="eyebrow">Seguridad de la Información</span>
          <h1>La Tríada CIA</h1>
          <p>
            No importa si proteges los servidores de un banco, el historial de un hospital o tu cuenta personal de redes sociales. 
            Toda estrategia de ciberseguridad se sostiene en el equilibrio de estos tres pilares fundamentales.
          </p>
        </header>

        {/* Infografía: Las 3 Cartas */}
        <section className="triad-grid" aria-label="Los tres pilares de la seguridad">
          {Object.values(triadData).map((pillar) => (
            <TriadCard 
              key={pillar.id}
              pillar={pillar}
              isActive={activePillar === pillar.id}
              onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
            />
          ))}
        </section>

        {/* Componente Interactivo: Validador de escenarios */}
        <ScenarioTester />

        <footer className="site-footer">
          <p>Infografía interactiva creada con React + Vite.</p>
        </footer>

      </main>
    </>
  );
}