import React, { useState, useEffect } from 'react';

// --- DATOS EXPANDIDOS ---
const triadData = {
  confidencialidad: {
    id: 'confidencialidad',
    title: 'Confidencialidad',
    color: '#3b82f6', // Blue
    icon: '🔒',
    shortDef: 'Garantizar que la información solo sea accesible para las personas autorizadas.',
    longDef: 'La confidencialidad es el pilar que previene la divulgación no autorizada de la información. Funciona bajo el principio de "necesidad de saber" (need-to-know) y el privilegio mínimo. Si un dato cae en manos de alguien que no tiene los permisos explícitos para verlo, este pilar se ha roto. Es el equivalente digital a la privacidad.',
    question: '¿Alguien que no debería, puede ver esto?',
    mechanisms: [
      { name: 'Cifrado (En reposo y en tránsito)', desc: 'Uso de algoritmos (AES, RSA) para volver los datos ilegibles sin la llave correcta.' },
      { name: 'Control de Acceso (RBAC)', desc: 'Asignar permisos basados en el rol del usuario en la organización.' },
      { name: 'Autenticación Fuerte (MFA)', desc: 'Exigir más de un método para verificar la identidad (ej. contraseña + código SMS).' }
    ],
    realCase: {
      title: 'Caso Equifax (2017)',
      desc: 'Una vulnerabilidad en un servidor web permitió a los atacantes acceder a los datos personales (nombres, fechas de nacimiento, números de seguro social) de casi 150 millones de personas. Fue una falla masiva de confidencialidad porque entidades no autorizadas leyeron datos altamente sensibles.'
    }
  },
  integridad: {
    id: 'integridad',
    title: 'Integridad',
    color: '#10b981', // Emerald
    icon: '🛡️',
    shortDef: 'Asegurar que la información sea precisa y no haya sido alterada de forma no autorizada.',
    longDef: 'La integridad garantiza que los datos sean confiables y exactos durante todo su ciclo de vida. Esto significa protegerlos contra modificaciones no autorizadas, ya sean intencionales (por un atacante) o accidentales (por un error del sistema o de un empleado). Si no puedes confiar en que tus datos son los originales, este pilar ha fallado.',
    question: '¿La información es correcta, confiable y original?',
    mechanisms: [
      { name: 'Funciones Hash (SHA-256)', desc: 'Crear una "huella digital" única de un archivo. Si el archivo cambia un bit, el hash cambia completamente.' },
      { name: 'Firmas Digitales', desc: 'Garantizan que un mensaje proviene de quien dice provenir y no fue alterado en el camino (No repudio).' },
      { name: 'Controles de Versiones y Auditoría', desc: 'Sistemas que registran quién modificó qué dato y cuándo (ej. Git, logs inmutables).' }
    ],
    realCase: {
      title: 'Ataque a la red SWIFT en el Banco de Bangladesh (2016)',
      desc: 'Los atacantes no solo robaron credenciales (Confidencialidad), sino que alteraron el software del banco para ocultar las transferencias fraudulentas que estaban realizando. Modificaron los registros para que los reportes impresos mostraran balances normales. Altera la verdad = Falla de Integridad.'
    }
  },
  disponibilidad: {
    id: 'disponibilidad',
    title: 'Disponibilidad',
    color: '#f59e0b', // Amber
    icon: '⚡',
    shortDef: 'Garantizar que los sistemas y los datos estén disponibles cuando se necesiten.',
    longDef: 'De nada sirve que la información sea secreta y exacta si los usuarios legítimos no pueden acceder a ella cuando la necesitan para trabajar. La disponibilidad se asegura de que los sistemas, redes y aplicaciones funcionen de manera ininterrumpida frente a ataques, fallos de hardware o desastres naturales.',
    question: '¿Puedo acceder al sistema en este preciso momento?',
    mechanisms: [
      { name: 'Redundancia y Alta Disponibilidad', desc: 'Tener servidores, discos (RAID) y conexiones de red de respaldo. Si uno falla, otro toma su lugar al instante.' },
      { name: 'Mitigación Anti-DDoS', desc: 'Servicios de red que filtran el tráfico basura diseñado para saturar los servidores.' },
      { name: 'Planes de Recuperación (DRP)', desc: 'Copias de seguridad regulares y probadas en sitios geográficamente separados (off-site backups).' }
    ],
    realCase: {
      title: 'Ataque DDoS a Dyn (2016)',
      desc: 'Un ataque masivo de botnets (cámaras y routers infectados) saturó los servidores DNS de Dyn. Como resultado, gran parte de internet en EE.UU. (Twitter, Netflix, Reddit) quedó inaccesible por horas. La información no fue robada ni alterada, pero nadie podía acceder a ella. Falla crítica de disponibilidad.'
    }
  }
};

const scenarios = [
  { 
    text: "Un atacante inunda la página web de una universidad con millones de solicitudes falsas. Los alumnos no pueden entrar a ver sus notas.", 
    answer: "disponibilidad",
    explanation: "El servicio dejó de funcionar para los usuarios legítimos. Es un clásico ataque DDoS (Denegación de Servicio)."
  },
  { 
    text: "Un empleado de finanzas deja su portátil desbloqueado en una cafetería. Alguien mira la pantalla y toma una foto de la nómina de la empresa.", 
    answer: "confidencialidad",
    explanation: "Información sensible fue vista por alguien sin autorización. El secreto se rompió."
  },
  { 
    text: "Un malware infecta el servidor de un hospital y cifra todos los historiales médicos, exigiendo un pago en Bitcoin para entregar la clave de descifrado.", 
    answer: "disponibilidad",
    explanation: "Aunque implica cifrado, el objetivo es impedir el acceso (Ransomware). Al no poder acceder a los datos cuando se necesitan, falla la disponibilidad."
  },
  { 
    text: "Un estudiante intercepta el tráfico de red de su profesor y modifica el paquete de datos que contiene su calificación final, cambiándola de un 4 a un 7 antes de que llegue a la base de datos.", 
    answer: "integridad",
    explanation: "El dato fue alterado en tránsito. La base de datos guardó información inexacta que no refleja la realidad."
  },
  {
    text: "Una empresa sufre una brecha y una base de datos con millones de contraseñas de usuarios en texto plano (sin cifrar) es publicada en un foro de hackers.",
    answer: "confidencialidad",
    explanation: "Las contraseñas (secretos) fueron expuestas al público. Es la violación de confidencialidad más severa."
  }
];

// --- COMPONENTES ---

// 1. Tarjeta Expandible
function ExpandableTriadCard({ pillar, isActive, onClick }) {
  return (
    <div className={`triad-card ${isActive ? 'active' : ''}`} style={{ '--accent-color': pillar.color }}>
      <div className="card-header" onClick={onClick}>
        <div className="card-title-area">
          <span className="card-icon">{pillar.icon}</span>
          <h2>{pillar.title}</h2>
        </div>
        <button className="expand-btn" aria-label="Expandir detalles">
          {isActive ? 'Menos info ▲' : 'Más info ▼'}
        </button>
      </div>
      
      <div className="card-summary" onClick={onClick}>
        <p>{pillar.shortDef}</p>
        <p className="question-text">"{pillar.question}"</p>
      </div>

      <div className={`card-expanded-content ${isActive ? 'open' : ''}`}>
        <div className="expanded-inner">
          <p className="long-def">{pillar.longDef}</p>
          
          <div className="mechanisms-section">
            <h3>Cómo se protege:</h3>
            <div className="mech-grid">
              {pillar.mechanisms.map((mech, idx) => (
                <div key={idx} className="mech-item">
                  <strong>{mech.name}</strong>
                  <p>{mech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="real-case-section">
            <span className="case-badge">CASO REAL</span>
            <h4>{pillar.realCase.title}</h4>
            <p>{pillar.realCase.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Simulador (Quiz) Mejorado
function EnhancedSimulator() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleGuess = (guess) => {
    if (feedback) return; // Evitar multiples clics
    const isCorrect = guess === scenarios[currentScenario].answer;
    setFeedback({ isCorrect, guess });
    if (isCorrect) setScore(score + 1);
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentScenario + 1 < scenarios.length) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentScenario(0);
    setScore(0);
    setFeedback(null);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / scenarios.length) * 100);
    return (
      <div className="scenario-tester result-view">
        <div className="result-circle" style={{ '--score-color': percentage >= 60 ? '#10b981' : '#f59e0b' }}>
          <span>{percentage}%</span>
        </div>
        <h2>Análisis Completado</h2>
        <p>Has clasificado correctamente {score} de {scenarios.length} incidentes de seguridad.</p>
        <button onClick={restart} className="action-btn">Repetir Simulación</button>
      </div>
    );
  }

  const currentData = scenarios[currentScenario];

  return (
    <div className="scenario-tester">
      <div className="tester-header">
        <span className="eyebrow">SIMULADOR DE INCIDENTES</span>
        <h2>Clasifica el Ataque</h2>
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentScenario) / scenarios.length) * 100}%` }}></div>
      </div>
      
      <div className="scenario-box">
        <span className="scenario-number">Escenario {currentScenario + 1} de {scenarios.length}</span>
        <p className="scenario-text">"{currentData.text}"</p>
      </div>

      <div className="tester-buttons">
        {Object.values(triadData).map((pillar) => {
          let btnClass = 'test-btn ';
          if (feedback) {
            if (pillar.id === currentData.answer) btnClass += 'correct-ans '; // La respuesta correcta siempre se marca
            if (feedback.guess === pillar.id && !feedback.isCorrect) btnClass += 'wrong-ans '; // Si adivinó mal, marcar en rojo
          }

          return (
            <button 
              key={pillar.id}
              onClick={() => handleGuess(pillar.id)}
              className={btnClass}
              style={{ '--btn-color': pillar.color }}
              disabled={feedback !== null}
            >
              {pillar.icon} {pillar.title}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.isCorrect ? 'success' : 'error'}`}>
          <div className="feedback-content">
            <strong>{feedback.isCorrect ? '¡Correcto!' : 'Incorrecto.'}</strong>
            <p>{currentData.explanation}</p>
          </div>
          <button onClick={nextQuestion} className="next-btn">Siguiente ➔</button>
        </div>
      )}
    </div>
  );
}

// --- APLICACIÓN PRINCIPAL ---
export default function App() {
  const [activePillar, setActivePillar] = useState(null);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#0f172a';
    document.body.style.color = '#f8fafc';
    document.body.style.fontFamily = "'Inter', 'Segoe UI', system-ui, sans-serif";
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        :root {
          --bg-color: #0f172a;
          --bg-darker: #0b1120;
          --surface-color: #1e293b;
          --surface-hover: #334155;
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --border-color: #334155;
          --accent-blue: #3b82f6;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Tipografía Base */
        h1, h2, h3, h4 { font-weight: 700; line-height: 1.2; color: var(--text-primary); }
        p { line-height: 1.6; color: var(--text-secondary); }

        /* Navegación Sticky */
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 24px;
          display: flex;
          justify-content: center;
          gap: 24px;
        }
        .nav-link {
          background: none; border: none; color: var(--text-secondary);
          font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.2s;
        }
        .nav-link:hover { color: var(--text-primary); }

        /* Contenedor Principal */
        .main-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          gap: 100px; /* Espaciado enorme entre secciones para dar respiro */
        }

        /* --- HERO --- */
        .hero { text-align: center; animation: fadeInDown 0.8s ease-out; }
        .eyebrow {
          display: inline-block; color: var(--accent-blue); font-size: 12px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;
          padding: 6px 12px; background: rgba(59, 130, 246, 0.1); border-radius: 20px; border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .hero h1 { font-size: clamp(40px, 6vw, 72px); margin-bottom: 24px; letter-spacing: -1px; }
        .hero p { font-size: 20px; max-width: 700px; margin: 0 auto; }

        /* --- CONCEPTO (DIAGRAMA CSS) --- */
        .concept-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
        .concept-text h2 { font-size: 32px; margin-bottom: 16px; }
        .concept-text p { margin-bottom: 16px; font-size: 16px; }
        
        .triangle-visual {
          position: relative; width: 300px; height: 260px; margin: 0 auto;
        }
        .tri-line { position: absolute; background: var(--border-color); z-index: 1;}
        .line-1 { width: 100%; height: 2px; bottom: 30px; left: 0; }
        .line-2 { width: 260px; height: 2px; top: 120px; left: -50px; transform: rotate(60deg); }
        .line-3 { width: 260px; height: 2px; top: 120px; right: -50px; transform: rotate(-60deg); }
        
        .tri-node {
          position: absolute; width: 80px; height: 80px; background: var(--surface-color);
          border: 2px solid var(--n-color); border-radius: 50%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; z-index: 2; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .tri-node span { font-size: 24px; margin-bottom: 4px; }
        .tri-node small { font-size: 10px; font-weight: 700; color: var(--n-color); text-transform: uppercase; }
        .node-c { top: 0; left: 110px; --n-color: #3b82f6; }
        .node-i { bottom: 0; right: 0; --n-color: #10b981; }
        .node-a { bottom: 0; left: 0; --n-color: #f59e0b; }

        /* --- TARJETAS DE PILARES (EXPANDIBLES) --- */
        .section-header { text-align: center; margin-bottom: 40px; }
        .section-header h2 { font-size: 36px; }
        .triad-stack { display: flex; flex-direction: column; gap: 24px; }

        .triad-card {
          background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 16px;
          position: relative; overflow: hidden; transition: all 0.3s ease;
        }
        .triad-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          background: var(--accent-color); opacity: 0.5; transition: width 0.3s ease;
        }
        .triad-card.active::before { width: 100%; opacity: 0.05; }
        .triad-card.active { border-color: var(--accent-color); }

        .card-header {
          padding: 24px 32px; display: flex; justify-content: space-between; align-items: center;
          cursor: pointer; position: relative; z-index: 10;
        }
        .card-title-area { display: flex; align-items: center; gap: 16px; }
        .card-icon { font-size: 28px; background: rgba(0,0,0,0.2); width: 48px; height: 48px; display: grid; place-items: center; border-radius: 10px; }
        .triad-card h2 { font-size: 24px; color: var(--text-primary); margin: 0; }
        .triad-card.active h2 { color: var(--accent-color); }
        .expand-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; pointer-events: none;}

        .card-summary { padding: 0 32px 24px; cursor: pointer; position: relative; z-index: 10;}
        .card-summary p { font-size: 16px; margin-bottom: 12px; }
        .question-text { font-style: italic; color: #e2e8f0 !important; border-left: 3px solid var(--accent-color); padding-left: 16px; }

        /* Contenido Oculto */
        .card-expanded-content {
          display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s ease-out;
        }
        .card-expanded-content.open { grid-template-rows: 1fr; }
        .expanded-inner { overflow: hidden; padding: 0 32px; }
        
        .long-def { font-size: 15px; margin-bottom: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);}
        
        .mechanisms-section { margin-bottom: 24px; }
        .mechanisms-section h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); margin-bottom: 16px;}
        .mech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
        .mech-item { background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; border-left: 2px solid var(--border-color); }
        .triad-card.active .mech-item { border-left-color: var(--accent-color); }
        .mech-item strong { display: block; font-size: 14px; color: var(--text-primary); margin-bottom: 8px; }
        .mech-item p { font-size: 13px; margin: 0; }

        .real-case-section { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 20px; border-radius: 8px; margin-bottom: 32px;}
        .case-badge { background: #ef4444; color: white; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 4px; margin-bottom: 12px; display: inline-block; letter-spacing: 1px;}
        .real-case-section h4 { color: #fca5a5; font-size: 16px; margin-bottom: 8px;}
        .real-case-section p { color: #fecaca; font-size: 14px; margin: 0;}

        /* --- TRADE-OFFS (EL EQUILIBRIO) --- */
        .tradeoffs-section { background: var(--bg-darker); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; text-align: center; }
        .tradeoffs-section h2 { font-size: 32px; margin-bottom: 16px; }
        .tradeoffs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 32px; text-align: left;}
        .trade-card { background: var(--surface-color); padding: 24px; border-radius: 12px; }
        .trade-card h3 { display: flex; align-items: center; gap: 8px; font-size: 18px; margin-bottom: 12px; color: #cbd5e1; }
        .trade-card p { font-size: 14px; }

        /* --- SIMULADOR (QUIZ) --- */
        .scenario-tester { background: var(--surface-color); border-radius: 24px; padding: 48px; border: 1px solid var(--border-color); }
        .tester-header { text-align: center; margin-bottom: 32px;}
        .tester-header h2 { font-size: 32px; }
        
        .progress-bar { width: 100%; height: 6px; background: var(--bg-darker); border-radius: 3px; margin-bottom: 32px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--accent-blue); transition: width 0.3s ease; }

        .scenario-box { background: var(--bg-color); padding: 32px; border-radius: 12px; margin-bottom: 32px; border-left: 4px solid var(--border-color); }
        .scenario-number { display: block; color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;}
        .scenario-text { font-size: 20px; color: var(--text-primary); line-height: 1.5; font-style: italic; }

        .tester-buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; }
        .test-btn {
          background: var(--bg-color); border: 2px solid var(--border-color); color: var(--text-primary);
          padding: 16px 24px; font-size: 16px; font-weight: 600; border-radius: 12px; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 12px; min-width: 200px; justify-content: center;
        }
        .test-btn:hover:not(:disabled) { border-color: var(--btn-color); background: rgba(255,255,255,0.02); }
        
        .test-btn.correct-ans { background: rgba(16, 185, 129, 0.1); border-color: #10b981; color: #10b981; }
        .test-btn.wrong-ans { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #ef4444; opacity: 0.7; }
        .test-btn:disabled:not(.correct-ans):not(.wrong-ans) { opacity: 0.3; }

        .feedback-msg { margin-top: 32px; padding: 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; gap: 24px; animation: fadeInDown 0.3s ease;}
        .feedback-msg.success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); }
        .feedback-msg.error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); }
        .feedback-content strong { display: block; font-size: 18px; margin-bottom: 8px; color: var(--text-primary); }
        .feedback-content p { margin: 0; font-size: 15px; color: #cbd5e1; }
        .next-btn { background: var(--text-primary); color: var(--bg-color); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: transform 0.2s; }
        .next-btn:hover { transform: translateX(4px); }

        /* Resultado Final */
        .result-view { text-align: center; }
        .result-circle { width: 120px; height: 120px; border-radius: 50%; border: 6px solid var(--score-color); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 32px; font-weight: 800; color: var(--score-color); }
        .result-view h2 { margin-bottom: 16px; }
        .result-view p { margin-bottom: 32px; font-size: 18px; }
        .action-btn { background: var(--accent-blue); color: white; border: none; padding: 16px 32px; font-size: 16px; font-weight: 700; border-radius: 8px; cursor: pointer; transition: background 0.2s;}
        .action-btn:hover { background: #2563eb; }

        /* --- FOOTER --- */
        .site-footer { text-align: center; padding: 40px 0; border-top: 1px solid var(--border-color); color: var(--text-secondary); font-size: 14px; margin-top: auto; }

        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
          .main-container { padding: 40px 16px; gap: 60px; }
          .hero h1 { font-size: 36px; }
          .concept-section { grid-template-columns: 1fr; text-align: center; }
          .triangle-visual { margin-top: 32px; }
          .tradeoffs-grid { grid-template-columns: 1fr; }
          .scenario-tester { padding: 24px; }
          .test-btn { width: 100%; justify-content: flex-start; }
          .feedback-msg { flex-direction: column; align-items: stretch; text-align: left; }
          .next-btn { width: 100%; text-align: center; }
          .card-header { padding: 20px; flex-direction: column; align-items: flex-start; gap: 16px; }
          .expand-btn { align-self: flex-start; }
        }
      `}</style>

      <nav className="sticky-nav">
        <button className="nav-link" onClick={() => scrollToSection('concept')}>Concepto</button>
        <button className="nav-link" onClick={() => scrollToSection('pillars')}>Pilares (Detalle)</button>
        <button className="nav-link" onClick={() => scrollToSection('tradeoffs')}>El Equilibrio</button>
        <button className="nav-link" onClick={() => scrollToSection('simulator')}>Simulador</button>
      </nav>

      <main className="main-container">
        
        {/* HERO */}
        <section className="hero">
          <span className="eyebrow">Fundamentos de Ciberseguridad</span>
          <h1>La Tríada CIA</h1>
          <p>El estándar global para evaluar y diseñar arquitecturas seguras. No es tecnología, es metodología.</p>
        </section>

        {/* CONCEPTO & DIAGRAMA */}
        <section id="concept" className="concept-section">
          <div className="concept-text">
            <h2>¿Por qué un Triángulo?</h2>
            <p>La Tríada CIA no es una lista de tareas, es un modelo de <strong>tensión constante</strong>. Representa los tres objetivos principales de la seguridad de la información.</p>
            <p>Si la información de tu organización (o tuya personal) no cumple con estas tres características de forma simultánea, tu sistema es vulnerable.</p>
          </div>
          <div className="triangle-visual" aria-hidden="true">
            <div className="tri-line line-1"></div>
            <div className="tri-line line-2"></div>
            <div className="tri-line line-3"></div>
            <div className="tri-node node-c"><span>🔒</span><small>Conf.</small></div>
            <div className="tri-node node-i"><span>🛡️</span><small>Integ.</small></div>
            <div className="tri-node node-a"><span>⚡</span><small>Disp.</small></div>
          </div>
        </section>

        {/* TARJETAS EXPANDIBLES */}
        <section id="pillars">
          <div className="section-header">
            <h2>Análisis de los Pilares</h2>
            <p>Haz clic en cada pilar para ver su definición completa, mecanismos de defensa y casos reales de fallos.</p>
          </div>
          <div className="triad-stack">
            {Object.values(triadData).map((pillar) => (
              <ExpandableTriadCard 
                key={pillar.id}
                pillar={pillar}
                isActive={activePillar === pillar.id}
                onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
              />
            ))}
          </div>
        </section>

        {/* EL EQUILIBRIO (TRADE-OFFS) */}
        <section id="tradeoffs" className="tradeoffs-section">
          <span className="eyebrow">El desafío del arquitecto</span>
          <h2>El problema del Equilibrio</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>Aumentar la seguridad en un pilar casi siempre tiene un costo operativo en otro. La seguridad perfecta no existe, se trata de gestionar el riesgo según el contexto.</p>
          
          <div className="tradeoffs-grid">
            <div className="trade-card">
              <h3>🔒 vs ⚡ (Confidencialidad vs Disponibilidad)</h3>
              <p>Si exiges un cifrado militar de múltiples capas y 3 métodos de autenticación para abrir un archivo, los datos estarán muy seguros, pero los empleados tardarán minutos en abrir un documento, afectando la disponibilidad del sistema para el trabajo ágil.</p>
            </div>
            <div className="trade-card">
              <h3>🛡️ vs ⚡ (Integridad vs Disponibilidad)</h3>
              <p>Si el sistema debe verificar decenas de firmas digitales y hashes antes de procesar una transacción financiera para asegurar que nada fue alterado, el procesamiento será más lento, pudiendo causar cuellos de botella en alta demanda.</p>
            </div>
          </div>
        </section>

        {/* SIMULADOR */}
        <section id="simulator">
          <EnhancedSimulator />
        </section>

      </main>

      <footer className="site-footer">
        <p>Infografía Educativa Avanzada · React + Vite</p>
      </footer>
    </>
  );
}