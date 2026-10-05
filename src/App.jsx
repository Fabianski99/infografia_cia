import React, { useState, useEffect } from 'react';

// --- DATOS EXPANDIDOS Y PROFUNDIZADOS ---
const triadData = {
  confidencialidad: {
    id: 'confidencialidad',
    title: 'Confidencialidad',
    color: '#3b82f6', // Blue
    icon: '🔒',
    shortDef: 'Garantizar que la información solo sea accesible para las personas o sistemas autorizados.',
    longDef: 'La confidencialidad previene la divulgación no autorizada de la información. Funciona bajo el principio de "necesidad de saber" (need-to-know) y el privilegio mínimo. Si un dato cae en manos de una entidad sin los permisos explícitos para verlo, este pilar se ha fracturado. Es la piedra angular de la privacidad y el cumplimiento normativo.',
    question: '¿Alguien que no debería, puede ver o acceder a esto?',
    mechanisms: [
      { name: 'Cifrado Fuerte (AES-256, RSA)', desc: 'Transformación algorítmica de los datos tanto en reposo (discos) como en tránsito (redes) para que sean ilegibles sin la llave criptográfica.' },
      { name: 'Gestión de Identidades (IAM y RBAC)', desc: 'Asignación de permisos granulares basados estrictamente en el rol del usuario, asegurando que nadie tenga más acceso del necesario.' },
      { name: 'Autenticación Multifactor (MFA)', desc: 'Exigir algo que el usuario sabe (contraseña), algo que tiene (token/móvil) o algo que es (biometría).' }
    ],
    advancedInfo: {
      standards: 'ISO/IEC 27001 (Anexo A.8 Control de Accesos), GDPR (Privacidad por Diseño).',
      kpis: ['Número de accesos no autorizados detectados.', 'Porcentaje de bases de datos críticas con cifrado activo.']
    },
    realCase: {
      title: 'Caso Equifax (2017)',
      desc: 'Una vulnerabilidad sin parchear en un servidor Apache Struts permitió a atacantes acceder a la base de datos central. Se extrajeron datos personales (SSN, fechas de nacimiento) de 147 millones de personas. Una falla catastrófica de confidencialidad al fallar los controles de acceso a datos en texto plano.'
    }
  },
  integridad: {
    id: 'integridad',
    title: 'Integridad',
    color: '#10b981', // Emerald
    icon: '🛡️',
    shortDef: 'Asegurar que la información sea exacta, completa y no haya sido alterada.',
    longDef: 'La integridad garantiza que los datos sean confiables durante todo su ciclo de vida. Esto significa protegerlos contra modificaciones no autorizadas, ya sean intencionales (fraude, inyección de código) o accidentales (errores humanos, corrupción de hardware). Si no puedes probar que tus datos son los originales, carecen de valor legal y operativo.',
    question: '¿La información es correcta, inmutable y verificable?',
    mechanisms: [
      { name: 'Funciones Hash Criptográficas (SHA-3)', desc: 'Generación de una "huella digital" matemática para archivos o mensajes. Si un solo bit cambia, el hash resultante cambia drásticamente.' },
      { name: 'Firmas Digitales (No repudio)', desc: 'Uso de criptografía asimétrica para garantizar que un mensaje u orden proviene del remitente real y no fue modificado en el camino.' },
      { name: 'Registros Inmutables (WORM)', desc: 'Sistemas de almacenamiento "Write Once, Read Many" y auditoría de logs protegida para registrar quién alteró qué dato y cuándo.' }
    ],
    advancedInfo: {
      standards: 'NIST SP 800-53 (Familia SI - System and Information Integrity).',
      kpis: ['Frecuencia de alertas de alteración de archivos de sistema (FIM).', 'Porcentaje de logs centralizados y protegidos contra escritura.']
    },
    realCase: {
      title: 'Ataque a la red SWIFT (Banco de Bangladesh, 2016)',
      desc: 'Los atacantes vulneraron la red del banco, pero su golpe maestro fue alterar el software local que procesaba las transacciones SWIFT. Al modificar los registros de las impresoras para ocultar las transferencias fraudulentas de $81 millones, destruyeron la integridad del sistema de auditoría del banco.'
    }
  },
  disponibilidad: {
    id: 'disponibilidad',
    title: 'Disponibilidad',
    color: '#f59e0b', // Amber
    icon: '⚡',
    shortDef: 'Garantizar que los sistemas y los datos estén operativos cuando se necesiten.',
    longDef: 'La seguridad es inútil si impide el funcionamiento del negocio. La disponibilidad asegura que los servicios, redes y aplicaciones respondan de manera oportuna frente a picos de demanda, ataques destructivos, fallos de hardware o desastres naturales. Está directamente ligada a la continuidad del negocio y los Acuerdos de Nivel de Servicio (SLA).',
    question: '¿Los usuarios legítimos pueden acceder al sistema en este preciso momento?',
    mechanisms: [
      { name: 'Alta Disponibilidad (HA) y Redundancia', desc: 'Diseño de arquitecturas sin puntos únicos de fallo (SPOF). Uso de balanceadores de carga, clústeres y arreglos RAID.' },
      { name: 'Mitigación y Filtrado Anti-DDoS', desc: 'Redes de distribución de contenido (CDN) y firewalls de capa de aplicación (WAF) que absorben y filtran tráfico malicioso volumétrico.' },
      { name: 'Planes de Recuperación (BCP/DRP)', desc: 'Estrategias de copias de seguridad (Regla 3-2-1), sitios alternos de procesamiento (Hot/Cold sites) y simulacros de recuperación.' }
    ],
    advancedInfo: {
      standards: 'ISO/IEC 22301 (Gestión de Continuidad de Negocio).',
      kpis: ['Uptime de servicios críticos (Ej: 99.99%).', 'RTO (Tiempo Objetivo de Recuperación) y RPO (Punto Objetivo de Recuperación).']
    },
    realCase: {
      title: 'Ataque DDoS a Dyn DNS (2016)',
      desc: 'La botnet Mirai, compuesta por miles de dispositivos IoT infectados (cámaras, routers), dirigió un tráfico masivo hacia los servidores DNS de Dyn. El resultado: gran parte de internet en EE.UU. (incluyendo Twitter, Netflix, y Reddit) quedó inaccesible. No robaron nada, pero paralizaron la operación.'
    }
  }
};

const scenarios = [
  { 
    text: "Un atacante inunda la página web de una universidad con millones de solicitudes falsas simultáneas. Los alumnos no pueden entrar a ver sus notas ni inscribir asignaturas.", 
    answer: "disponibilidad",
    explanation: "El servicio dejó de funcionar para los usuarios legítimos. Es un ataque volumétrico DDoS (Denegación de Servicio Distribuido) diseñado para agotar los recursos de la red."
  },
  { 
    text: "Un empleado de finanzas deja su portátil desbloqueado en la sala de reuniones. Alguien mira la pantalla y toma una fotografía de la matriz de sueldos de la directiva.", 
    answer: "confidencialidad",
    explanation: "Información altamente sensible fue visualizada por un individuo sin autorización. El secreto se rompió por una falla en las políticas de escritorio limpio."
  },
  { 
    text: "Un grupo de ransomware infecta los servidores centrales de un municipio, cifrando todos los discos duros y exigiendo un pago para entregar la clave de descifrado.", 
    answer: "disponibilidad",
    explanation: "Aunque la técnica usa criptografía, el impacto real es que los funcionarios no pueden usar los sistemas ni acceder a los datos para trabajar. El servicio se interrumpió por completo."
  },
  { 
    text: "Un estudiante intercepta el tráfico de red Wi-Fi no cifrado de su profesor y modifica los paquetes que contienen las calificaciones, cambiando su nota antes de que se guarde en la base de datos.", 
    answer: "integridad",
    explanation: "El dato fue alterado intencionalmente en tránsito (Ataque Man-in-the-Middle). La base de datos ahora contiene información falsa e inexacta."
  },
  {
    text: "Debido a una mala configuración en un bucket de Amazon S3, una base de datos con contraseñas e historiales de compras de miles de clientes queda indexada en Google y expuesta al público.",
    answer: "confidencialidad",
    explanation: "Datos que debían ser privados quedaron expuestos al dominio público. Es una brecha de confidencialidad masiva por negligencia en la configuración (Misconfiguration)."
  }
];

// --- COMPONENTES SECUNDARIOS ---

function ExpandableTriadCard({ pillar, isActive, onClick }) {
  return (
    <div className={`triad-card ${isActive ? 'active' : ''}`} style={{ '--accent-color': pillar.color }}>
      <div className="card-header" onClick={onClick}>
        <div className="card-title-area">
          <span className="card-icon">{pillar.icon}</span>
          <h2>{pillar.title}</h2>
        </div>
        <button className="expand-btn" aria-label="Expandir detalles">
          {isActive ? 'Colapsar detalles ▲' : 'Explorar a fondo ▼'}
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
            <h3>Arquitectura de Defensa:</h3>
            <div className="mech-grid">
              {pillar.mechanisms.map((mech, idx) => (
                <div key={idx} className="mech-item">
                  <strong>{mech.name}</strong>
                  <p>{mech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="advanced-info-grid">
            <div className="adv-box">
              <span className="adv-icon">📋</span>
              <div>
                <h4>Estándares</h4>
                <p>{pillar.advancedInfo.standards}</p>
              </div>
            </div>
            <div className="adv-box">
              <span className="adv-icon">📊</span>
              <div>
                <h4>KPIs Clave</h4>
                <ul>
                  {pillar.advancedInfo.kpis.map((kpi, idx) => <li key={idx}>{kpi}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="real-case-section">
            <div className="case-header">
              <span className="case-badge">ANÁLISIS DE CASO REAL</span>
              <h4>{pillar.realCase.title}</h4>
            </div>
            <p>{pillar.realCase.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnhancedSimulator() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleGuess = (guess) => {
    if (feedback) return;
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
        <div className="result-circle" style={{ '--score-color': percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444' }}>
          <span>{percentage}%</span>
        </div>
        <h2>Evaluación Completada</h2>
        <p>Has clasificado correctamente {score} de {scenarios.length} incidentes críticos de seguridad.</p>
        <button onClick={restart} className="action-btn">Repetir Simulación</button>
      </div>
    );
  }

  const currentData = scenarios[currentScenario];

  return (
    <div className="scenario-tester">
      <div className="tester-header">
        <span className="eyebrow">PONLO A PRUEBA</span>
        <h2>Clasifica la Brecha</h2>
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentScenario) / scenarios.length) * 100}%` }}></div>
      </div>
      
      <div className="scenario-box">
        <span className="scenario-number">Incidente reportado {currentScenario + 1} de {scenarios.length}</span>
        <p className="scenario-text">"{currentData.text}"</p>
      </div>

      <div className="tester-buttons">
        {Object.values(triadData).map((pillar) => {
          let btnClass = 'test-btn ';
          if (feedback) {
            if (pillar.id === currentData.answer) btnClass += 'correct-ans ';
            if (feedback.guess === pillar.id && !feedback.isCorrect) btnClass += 'wrong-ans ';
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
            <strong>{feedback.isCorrect ? '¡Evaluación Correcta!' : 'Diagnóstico Incorrecto'}</strong>
            <p>{currentData.explanation}</p>
          </div>
          <button onClick={nextQuestion} className="next-btn">
            {currentScenario + 1 === scenarios.length ? 'Ver Resultados' : 'Siguiente Caso ➔'}
          </button>
        </div>
      )}
    </div>
  );
}

// --- APLICACIÓN PRINCIPAL Y ESTILOS CSS ---
export default function App() {
  const [activePillar, setActivePillar] = useState(null);

  useEffect(() => {
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflowX = 'hidden'; // Prevenir scroll horizontal accidental

    document.body.style.width = '100%';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#0b1120'; 
    document.body.style.color = '#f8fafc';
    document.body.style.fontFamily = "'Inter', 'Segoe UI', system-ui, sans-serif";
    document.body.style.overflowX = 'hidden';

    // Importante: Si estás usando Vite, el div #root suele tener un max-width. Lo quitamos.
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.width = '100%';
      rootElement.style.maxWidth = 'none';
      rootElement.style.margin = '0';
      rootElement.style.padding = '0';
    }
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          --neon-blue: #60a5fa;
          --neon-green: #34d399;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        h1, h2, h3, h4 { font-weight: 700; line-height: 1.2; color: var(--text-primary); }
        p { line-height: 1.7; color: var(--text-secondary); margin-bottom: 16px; }

        /* NAVEGACIÓN STICKY */
        .sticky-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(11, 17, 32, 0.9); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 24px; display: flex; justify-content: center; gap: 32px;
          width: 100%; /* Asegurar que ocupe todo el ancho */
        }
        .nav-link {
          background: none; border: none; color: var(--text-secondary);
          font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.2s;
        }
        .nav-link:hover { color: var(--text-primary); text-shadow: 0 0 10px rgba(255,255,255,0.2); }

        /* CONTENEDORES AMPLIADOS - AHORA REALMENTE FULL WIDTH */
        .main-container {
          width: 100vw; /* Forzar el ancho de la ventana */
          max-width: 100%; /* Evitar restricciones previas */
          margin: 0;
          padding: 80px 4vw; /* Padding lateral fluido basado en el viewport */
          display: flex; flex-direction: column; gap: 120px;
          box-sizing: border-box; /* Asegurar que el padding no añada scroll horizontal */
        }

        /* Envoltorio interno opcional para secciones muy anchas si no quieres que el texto llegue de borde a borde en monitores 4k */
        .section-wrapper {
            max-width: 1800px; /* Un límite muy amplio, pero que previene líneas de texto kilométricas */
            margin: 0 auto;
            width: 100%;
        }

        /* --- HERO --- */
        .hero { text-align: center; animation: fadeInDown 0.8s ease-out; max-width: 900px; margin: 0 auto; }
        .eyebrow {
          display: inline-block; color: var(--neon-blue); font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px;
          padding: 8px 16px; background: rgba(59, 130, 246, 0.1); border-radius: 30px; border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        }
        .hero h1 { font-size: clamp(48px, 6vw, 80px); margin-bottom: 32px; letter-spacing: -1.5px; }
        .hero p { font-size: 22px; line-height: 1.6; }

        /* --- CONCEPTO Y TRIANGULO CORREGIDO --- */
        .concept-section { 
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: center; 
          background: var(--bg-color); padding: 70px; border-radius: 24px; border: 1px solid var(--border-color);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        /* Rediseño de texto a la izquierda y más moderno */
        .concept-text { text-align: left; }
        .concept-text h2 { font-size: 42px; margin-bottom: 24px; }
        .concept-text p { font-size: 18px; color: #cbd5e1;}
        
        .accent-border {
          border-left: 4px solid var(--accent-blue);
          padding-left: 24px;
          margin-bottom: 32px;
        }

        .info-highlight {
          margin-top: 32px;
          background: linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 24px;
          border-radius: 16px;
        }
        .info-highlight h4 { color: var(--neon-blue); margin-bottom: 12px; font-size: 18px; display: flex; align-items: center; gap: 8px;}
        .info-highlight p { font-size: 16px; margin: 0; color: #94a3b8;}
        
        .triangle-container {
          position: relative; width: 100%; max-width: 400px; height: 350px; margin: 0 auto;
        }
        .triangle-svg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
        }
        .tri-node {
          position: absolute; width: 100px; height: 100px; background: var(--surface-color);
          border: 3px solid var(--n-color); border-radius: 50%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; z-index: 2; box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .tri-node:hover { transform: scale(1.1); box-shadow: 0 0 30px var(--n-color); }
        .tri-node span { font-size: 32px; margin-bottom: 4px; }
        .tri-node small { font-size: 12px; font-weight: 800; color: var(--n-color); text-transform: uppercase; letter-spacing: 1px; }
        
        .node-c { top: 0; left: calc(50% - 50px); --n-color: #3b82f6; }
        .node-i { bottom: 0; right: 10px; --n-color: #10b981; }
        .node-a { bottom: 0; left: 10px; --n-color: #f59e0b; }

        /* --- SECCIONES TEÓRICAS (ALINEADAS Y MEJORADAS) --- */
        .theory-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 40px; }
        .theory-card { 
          background: var(--surface-color); padding: 50px; border-radius: 20px; 
          border: 1px solid var(--border-color); text-align: left;
          position: relative; overflow: hidden;
        }
        .theory-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, var(--accent-blue), transparent);
        }
        .card-header-icon {
          font-size: 40px; margin-bottom: 24px; display: inline-block;
          background: rgba(0,0,0,0.3); padding: 16px; border-radius: 16px;
        }
        .theory-card h3 { font-size: 32px; margin-bottom: 24px; }
        .theory-card p { font-size: 17px; margin-bottom: 24px; color: #cbd5e1;}
        
        .modern-pills { display: flex; flex-wrap: wrap; gap: 12px; margin: 32px 0; }
        .pill { 
          background: rgba(59, 130, 246, 0.1); color: var(--neon-blue);
          padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .steps-list { list-style: none; display: flex; flex-direction: column; gap: 20px; margin-top: 30px;}
        .steps-list li { display: flex; gap: 20px; align-items: flex-start; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.02);}
        .step-num { background: var(--accent-blue); color: white; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; font-weight: bold; font-size: 16px; flex-shrink: 0; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);}
        .steps-list h4 { color: var(--text-primary); font-size: 16px; margin-bottom: 8px; }
        .steps-list p { margin: 0; font-size: 14px; color: #94a3b8;}

        /* --- TARJETAS DE PILARES --- */
        .section-header { text-align: center; margin-bottom: 60px; max-width: 800px; margin-inline: auto;}
        .section-header h2 { font-size: 42px; margin-bottom: 16px;}
        .section-header p { font-size: 18px;}
        
        .triad-stack { display: flex; flex-direction: column; gap: 24px; max-width: 1100px; margin: 0 auto; }

        .triad-card {
          background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 16px;
          position: relative; overflow: hidden; transition: all 0.3s ease;
        }
        .triad-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%;
          background: var(--accent-color); transition: width 0.4s ease, opacity 0.4s ease;
        }
        .triad-card.active::before { width: 100%; opacity: 0.03; }
        .triad-card.active { border-color: var(--accent-color); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }

        .card-header { padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; position: relative; z-index: 10; }
        .card-title-area { display: flex; align-items: center; gap: 24px; }
        .card-icon { font-size: 32px; background: rgba(0,0,0,0.3); width: 64px; height: 64px; display: grid; place-items: center; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .triad-card h2 { font-size: 28px; margin: 0; }
        .triad-card.active h2 { color: var(--accent-color); }
        .expand-btn { background: var(--bg-darker); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; pointer-events: none; text-transform: uppercase; letter-spacing: 1px;}

        .card-summary { padding: 0 40px 30px; cursor: pointer; position: relative; z-index: 10;}
        .card-summary p { font-size: 18px; margin-bottom: 16px; }
        .question-text { font-style: italic; color: #cbd5e1 !important; border-left: 3px solid var(--accent-color); padding-left: 20px; font-size: 17px !important; margin: 0;}

        .card-expanded-content { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-expanded-content.open { grid-template-rows: 1fr; }
        .expanded-inner { overflow: hidden; padding: 0 40px; }
        
        .long-def { font-size: 16px; margin-bottom: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05);}
        
        .mechanisms-section { margin-bottom: 32px; }
        .mechanisms-section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-secondary); margin-bottom: 20px;}
        .mech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .mech-item { background: rgba(0,0,0,0.25); padding: 20px; border-radius: 12px; border-left: 3px solid var(--border-color); }
        .triad-card.active .mech-item { border-left-color: var(--accent-color); }
        .mech-item strong { display: block; font-size: 15px; color: var(--text-primary); margin-bottom: 10px; }
        .mech-item p { font-size: 14px; margin: 0; }

        .advanced-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .adv-box { display: flex; gap: 16px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); padding: 20px; border-radius: 12px; }
        .adv-icon { font-size: 24px; opacity: 0.8;}
        .adv-box h4 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); margin-bottom: 8px;}
        .adv-box p, .adv-box ul { font-size: 13px; color: #cbd5e1; margin: 0;}
        .adv-box ul { padding-left: 16px; line-height: 1.5;}

        .real-case-section { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); padding: 24px; border-radius: 12px; margin-bottom: 40px;}
        .case-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .case-badge { background: #ef4444; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; flex-shrink: 0;}
        .real-case-section h4 { color: #fca5a5; font-size: 18px; margin: 0;}
        .real-case-section p { color: #fecaca; font-size: 15px; margin: 0;}

        /* --- TRADE-OFFS (EL EQUILIBRIO) MEJORADO --- */
        .tradeoffs-section { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 32px; padding: 70px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);}
        .tradeoffs-section h2 { font-size: 42px; margin-bottom: 20px; }
        .tradeoffs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px; margin-top: 50px; text-align: left;}
        .trade-card { background: var(--surface-color); padding: 40px; border-radius: 20px; border: 1px solid transparent; transition: border 0.3s; }
        .trade-card:hover { border-color: var(--accent-blue); }
        
        /* Nuevos estilos para los títulos VS sin emojis */
        .trade-title { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px;}
        .trade-term { font-size: 18px; font-weight: 700; padding: 8px 16px; border-radius: 8px; background: rgba(255,255,255,0.03); letter-spacing: 0.5px;}
        .trade-term.conf { color: #3b82f6; border-bottom: 2px solid #3b82f6; }
        .trade-term.disp { color: #f59e0b; border-bottom: 2px solid #f59e0b; }
        .trade-term.integ { color: #10b981; border-bottom: 2px solid #10b981; }
        .trade-vs { font-size: 13px; font-weight: 900; background: var(--bg-darker); color: var(--text-secondary); width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--border-color); }
        
        .trade-card p { font-size: 16px; margin: 0; text-align: center; color: #cbd5e1; line-height: 1.6;}

        /* --- NUEVO BLOQUE VISUAL ZERO TRUST --- */
        .zt-comparison { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 16px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.02);}
        .zt-box { flex: 1; text-align: center; }
        .zt-badge { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; background: var(--bg-darker); color: var(--text-secondary); border: 1px solid var(--border-color);}
        .zt-badge.active { background: rgba(59, 130, 246, 0.15); color: var(--neon-blue); border-color: rgba(59, 130, 246, 0.3);}
        .zt-box strong { display: block; font-size: 16px; color: var(--text-primary); margin-bottom: 4px;}
        .zt-box small { display: block; font-size: 13px; color: #94a3b8; font-style: italic;}
        .zt-arrow { color: var(--border-color); display: flex; align-items: center;}

        /* --- SIMULADOR --- */
        .scenario-tester { background: var(--surface-color); border-radius: 32px; padding: 70px; border: 1px solid var(--border-color); max-width: 1100px; margin: 0 auto; width: 100%;}
        .tester-header { text-align: center; margin-bottom: 40px;}
        .tester-header h2 { font-size: 42px; }
        
        .progress-bar { width: 100%; height: 8px; background: var(--bg-darker); border-radius: 4px; margin-bottom: 40px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--accent-blue); transition: width 0.4s ease; }

        .scenario-box { background: var(--bg-darker); padding: 40px; border-radius: 16px; margin-bottom: 40px; border-left: 6px solid var(--border-color); }
        .scenario-number { display: block; color: var(--text-secondary); font-size: 15px; margin-bottom: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;}
        .scenario-text { font-size: 24px; color: var(--text-primary); line-height: 1.5; font-style: italic; margin: 0;}

        .tester-buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .test-btn {
          background: var(--bg-color); border: 2px solid var(--border-color); color: var(--text-primary);
          padding: 20px; font-size: 18px; font-weight: 600; border-radius: 16px; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .test-btn:hover:not(:disabled) { border-color: var(--btn-color); background: rgba(255,255,255,0.03); transform: translateY(-2px); }
        
        .test-btn.correct-ans { background: rgba(16, 185, 129, 0.1); border-color: #10b981; color: #10b981; box-shadow: 0 0 20px rgba(16,185,129,0.2);}
        .test-btn.wrong-ans { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #ef4444; opacity: 0.5; }
        .test-btn:disabled:not(.correct-ans):not(.wrong-ans) { opacity: 0.2; }

        .feedback-msg { margin-top: 40px; padding: 30px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; gap: 30px; animation: fadeInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);}
        .feedback-msg.success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); }
        .feedback-msg.error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); }
        .feedback-content strong { display: block; font-size: 22px; margin-bottom: 12px; color: var(--text-primary); }
        .feedback-content p { margin: 0; font-size: 16px; color: #cbd5e1; }
        .next-btn { background: var(--text-primary); color: var(--bg-darker); border: none; padding: 16px 32px; font-size: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; transition: transform 0.2s, background 0.2s; }
        .next-btn:hover { transform: translateX(5px); background: #fff; }

        .result-view { text-align: center; }
        .result-circle { width: 160px; height: 160px; border-radius: 50%; border: 8px solid var(--score-color); display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; font-size: 48px; font-weight: 800; color: var(--score-color); box-shadow: 0 0 30px rgba(0,0,0,0.2) inset;}
        .result-view h2 { margin-bottom: 20px; font-size: 36px; }
        .result-view p { margin-bottom: 40px; font-size: 20px; color: #cbd5e1; }
        .action-btn { background: var(--accent-blue); color: white; border: none; padding: 20px 40px; font-size: 18px; font-weight: 700; border-radius: 12px; cursor: pointer; transition: background 0.2s, transform 0.2s;}
        .action-btn:hover { background: #2563eb; transform: translateY(-2px); }

        .site-footer { text-align: center; padding: 40px 0; border-top: 1px solid var(--border-color); background: var(--bg-darker); color: var(--text-secondary); font-size: 15px; }

        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        /* --- RESPONSIVE --- */
        @media (max-width: 1200px) {
          .concept-section { grid-template-columns: 1fr; text-align: left; padding: 50px; }
          .triangle-container { margin-top: 40px; }
        }

        @media (max-width: 1024px) {
          .main-container { padding: 60px 5vw; gap: 80px;}
          .theory-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .sticky-nav { gap: 16px; overflow-x: auto; justify-content: flex-start; padding: 16px; }
          .nav-link { white-space: nowrap; }
          .hero h1 { font-size: 42px; }
          .hero p { font-size: 18px; }
          .concept-section { padding: 30px; }
          .card-header { padding: 24px; flex-direction: column; align-items: flex-start; gap: 16px; }
          .card-title-area { width: 100%; }
          .expand-btn { align-self: flex-start; width: 100%; text-align: center; }
          .card-summary, .expanded-inner { padding: 0 24px; }
          .advanced-info-grid { grid-template-columns: 1fr; }
          .tradeoffs-section, .scenario-tester { padding: 30px; border-radius: 20px;}
          .feedback-msg { flex-direction: column; align-items: stretch; text-align: left; }
          .next-btn { width: 100%; text-align: center; }
          .case-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <nav className="sticky-nav">
        <button className="nav-link" onClick={() => scrollToSection('concept')}>Fundamentos</button>
        <button className="nav-link" onClick={() => scrollToSection('theory')}>Modernidad</button>
        <button className="nav-link" onClick={() => scrollToSection('pillars')}>Los 3 Pilares</button>
        <button className="nav-link" onClick={() => scrollToSection('tradeoffs')}>El Equilibrio</button>
        <button className="nav-link" onClick={() => scrollToSection('simulator')}>Simulador</button>
      </nav>

      {}
      <main className="main-container">
        
        {/* HERO */}
        <section className="hero section-wrapper">
          <span className="eyebrow">Arquitectura de Seguridad</span>
          <h1>La Tríada CIA</h1>
          <p>El estándar internacional definitivo para evaluar riesgos y diseñar arquitecturas ciberseguras. Comprenderlo no es tecnología, es metodología.</p>
        </section>

        {/* CONCEPTO & DIAGRAMA SVG PERFECTO (Rediseñado alineado a la izquierda) */}
        <section id="concept" className="concept-section section-wrapper">
          <div className="concept-text">
            <span className="eyebrow" style={{marginBottom: '16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)'}}>Concepto Core</span>
            <h2>El Modelo Fundamental</h2>
            
            <div className="accent-border">
              <p>La Tríada CIA (Confidentiality, Integrity, Availability) no es una simple lista de tareas. Es un modelo de <strong>tensión geométrica constante</strong>.</p>
              <p>Representa los tres objetivos supremos de la seguridad de la información. Si la data de tu organización no cumple con estas tres características de forma simultánea e ininterrumpida, tu ecosistema está técnicamente vulnerado, incluso si aún no ha sido atacado.</p>
            </div>

            {/* INFO AGREGADA: Sin borrar lo anterior, se añade profundidad teórica */}
            <div className="info-highlight">
              <h4><span>💡</span> El Efecto Dominó y su Evolución</h4>
              <p>Históricamente originado en el ámbito militar y de inteligencia, este modelo se ha convertido en el estándar de oro corporativo. Una falla en un vértice inevitablemente desestabiliza los otros: si un ataque de <em>ransomware</em> cifra tus discos (pérdida severa de <strong>Disponibilidad</strong>), casi siempre viene acompañado de la exfiltración o robo de esos datos (ruptura total de la <strong>Confidencialidad</strong>).</p>
            </div>
          </div>
          
          <div className="triangle-container" aria-hidden="true">
            <svg viewBox="0 0 400 350" className="triangle-svg">
              <polygon points="200,50 340,300 60,300" fill="none" stroke="var(--border-color)" strokeWidth="4" />
            </svg>
            <div className="tri-node node-c"><span>🔒</span><small>Conf.</small></div>
            <div className="tri-node node-i"><span>🛡️</span><small>Integ.</small></div>
            <div className="tri-node node-a"><span>⚡</span><small>Disp.</small></div>
          </div>
        </section>

        {/* SECCIÓN MODERNA Y APLICACIÓN (Rediseñado alineado a la izquierda con más datos) */}
        <section id="theory">
          <div className="theory-grid">
            <div className="theory-card">
              <div className="card-header-icon">🌐</div>
              <h3>La Tríada en la era "Zero Trust"</h3>
              <p>Históricamente, las redes confiaban en todo lo que estuviera "dentro" del perímetro de la empresa. Hoy, el paradigma <strong>Zero Trust (Confianza Cero)</strong> asume que la red ya está comprometida desde el inicio.</p>
              
              {/* NUEVO BLOQUE VISUAL AÑADIDO PARA EVITAR EL VACÍO */}
              <div className="zt-comparison">
                <div className="zt-box">
                  <span className="zt-badge">Modelo Anterior</span>
                  <strong>Castillo y Foso</strong>
                  <small>"Confiable por estar dentro"</small>
                </div>
                <div className="zt-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
                <div className="zt-box">
                  <span className="zt-badge active">Estándar Actual</span>
                  <strong>Verificación Continua</strong>
                  <small>"Nunca confiar, siempre validar"</small>
                </div>
              </div>

              <p>Bajo este modelo, la Tríada CIA se aplica no solo al perímetro, sino a cada micro-transacción. La <em>Confidencialidad</em> exige verificar la identidad en cada petición, la <em>Integridad</em> asume que los paquetes pueden estar envenenados internamente, y la <em>Disponibilidad</em> requiere arquitecturas elásticas en la nube inmunes a fallas locales.</p>
              
              <div className="modern-pills">
                <span className="pill">Microsegmentación</span>
                <span className="pill">Telemetría Avanzada</span>
                <span className="pill">Identidad como Perímetro</span>
              </div>
              <p style={{fontSize: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px', color: '#94a3b8'}}>
                Ya no basta con proteger la puerta de entrada. La seguridad debe integrarse en el código fuente de cada aplicación y en la validación continua de cada usuario activo.
              </p>
            </div>
            
            <div className="theory-card">
              <div className="card-header-icon">⚙️</div>
              <h3>Fases de Implementación</h3>
              <p>Aplicar el modelo CIA a una empresa requiere un ciclo de vida estructurado e iterativo:</p>
              <ul className="steps-list">
                <li>
                  <div className="step-num">1</div>
                  <div>
                    <h4>Clasificación de Activos</h4>
                    <p>No se puede proteger lo que no se conoce. Identificar y catalogar la criticidad de los datos (Públicos, Internos, Confidenciales).</p>
                  </div>
                </li>
                <li>
                  <div className="step-num">2</div>
                  <div>
                    <h4>Auditoría de Brechas</h4>
                    <p>Mapear el estado actual contra los 3 pilares para descubrir vulnerabilidades y falta de controles técnicos.</p>
                  </div>
                </li>
                <li>
                  <div className="step-num">3</div>
                  <div>
                    <h4>Despliegue de Controles</h4>
                    <p>Implementar las mitigaciones técnicas (cifrado, firewalls, backups inmutables).</p>
                  </div>
                </li>
                {/* INFO AGREGADA: Dos pasos vitales adicionales sin borrar los anteriores */}
                <li>
                  <div className="step-num">4</div>
                  <div>
                    <h4>Monitorización Continua (SOC/SIEM)</h4>
                    <p>Vigilar en tiempo real los 3 pilares mediante analítica de logs para detectar intentos de brecha inmediatamente.</p>
                  </div>
                </li>
                <li>
                  <div className="step-num">5</div>
                  <div>
                    <h4>Respuesta a Incidentes (IR)</h4>
                    <p>Tener <em>playbooks</em> probados para restaurar la disponibilidad e investigar la ruptura de confidencialidad o integridad.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* TARJETAS EXPANDIBLES (Se mantienen intactas por su excelente funcionalidad) */}
        <section id="pillars" className="section-wrapper">
          <div className="section-header">
            <h2>Análisis Profundo de Pilares</h2>
            <p>Despliega cada tarjeta para explorar la arquitectura técnica, los estándares de la industria y la autopsia de un incidente global real.</p>
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
          <span className="eyebrow" style={{marginBottom: '16px'}}>El desafío del arquitecto de seguridad</span>
          <h2>El Problema de la Tensión Operativa</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '18px' }}>Aumentar drásticamente la seguridad en un pilar casi siempre tiene un costo friccional en otro. La "Seguridad Perfecta" es teórica; la práctica consiste en gestionar y aceptar el riesgo según el contexto del negocio.</p>
          
          <div className="tradeoffs-grid">
            <div className="trade-card">
              <div className="trade-title">
                <span className="trade-term conf">Confidencialidad</span>
                <span className="trade-vs">VS</span>
                <span className="trade-term disp">Disponibilidad</span>
              </div>
              <p>Si exiges un cifrado asimétrico complejo y 3 métodos de autenticación (biometría, token físico y contraseña) para abrir cada archivo, los datos serán impenetrables, pero el personal tardará minutos en acceder a ellos, arruinando la agilidad y disponibilidad del sistema en una urgencia operativa.</p>
            </div>
            <div className="trade-card">
              <div className="trade-title">
                <span className="trade-term integ">Integridad</span>
                <span className="trade-vs">VS</span>
                <span className="trade-term disp">Disponibilidad</span>
              </div>
              <p>Si un sistema transaccional debe verificar decenas de firmas digitales, cotejar hashes contra bases de datos externas y grabar en 3 blockchains inmutables antes de aprobar una compra para asegurar integridad total, el procesamiento será tan lento que causará caídas de servicio (timeouts) durante picos de demanda.</p>
            </div>
          </div>
        </section>

        {/* SIMULADOR */}
        <section id="simulator" className="section-wrapper">
          <EnhancedSimulator />
        </section>

      </main>

      <footer className="site-footer">
        <p>Documentación Profesional de Ciberseguridad · Arquitectura e Infografía Interactiva</p>
      </footer>
    </>
  );
}