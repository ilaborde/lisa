import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  ALL_SCALES,
  NOTE_NAMES,
  ScaleKey,
  ScaleRecord,
  getChordFromRoot,
  getChordTypeDefinition,
  getModeByKey,
  getParallelScaleInfo,
  getRelativeMajor,
  getScaleDegreeNames,
  getScaleFormula,
  getScaleNotes,
  getScaleCharacteristic,
  getModeTransition,
} from './music/theory';
import { Fretboard } from './components/Fretboard';
import { HarmonyTable } from './components/HarmonyTable';
import { CircleOfFifths } from './components/CircleOfFifths';
import { IntervalTool } from './components/IntervalTool';
import { ChordTool } from './components/ChordTool';
import { ModeComparer } from './components/ModeComparer';

const ROOT_OPTIONS = NOTE_NAMES.filter((note) => !note.includes('/'));
const MODE_OPTIONS: Array<ScaleRecord> = ALL_SCALES;

function App() {
  const [root, setRoot] = useState('G');
  const [scaleKey, setScaleKey] = useState<ScaleKey>('mixolydian');
  const [showTetrads, setShowTetrads] = useState(false);
  const [labelMode, setLabelMode] = useState<'notes' | 'degrees' | 'both'>('both');

  const mode = useMemo(() => getModeByKey(scaleKey), [scaleKey]);
  const scaleNotes = useMemo(() => getScaleNotes(root, scaleKey), [root, scaleKey]);
  const scaleDegrees = useMemo(() => getScaleDegreeNames(scaleKey), [scaleKey]);
  const formula = useMemo(() => getScaleFormula(scaleKey), [scaleKey]);
  const characteristic = useMemo(() => getScaleCharacteristic(scaleKey), [scaleKey]);
  const parallel = useMemo(() => getParallelScaleInfo(root, scaleKey), [root, scaleKey]);
  const relativeMajor = useMemo(() => getRelativeMajor(root, scaleKey), [root, scaleKey]);
  const harmony = useMemo(() => getChordFromRoot(root, scaleKey, showTetrads), [root, scaleKey, showTetrads]);
  const circleMode = useMemo(() => getModeTransition(root), [root]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Lisa</p>
          <h1>Teoría musical interactiva para guitarra</h1>
        </div>
        <nav className="topnav" aria-label="Navegación principal">
          <a href="#explorar">Explorar</a>
          <a href="#modos">Modos</a>
          <a href="#armonia">Armonía</a>
          <a href="#acordes">Acordes</a>
          <a href="#intervalos">Intervalos</a>
          <a href="#circulo">Círculo</a>
        </nav>
      </header>

      <main>
        <section className="hero card" id="explorar">
          <div className="hero-header">
            <div>
              <p className="eyebrow">Tónica</p>
              <select value={root} onChange={(event) => setRoot(event.target.value)}>
                {ROOT_OPTIONS.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="eyebrow">Escala / Modo</p>
              <select value={scaleKey} onChange={(event) => setScaleKey(event.target.value as ScaleKey)}>
                {MODE_OPTIONS.map((scale) => (
                  <option key={scale.key} value={scale.key}>
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="scale-preview">
            <div className="scale-notes">
              {scaleNotes.map((note, index) => (
                <span key={`${note}-${index}`} className={index === 0 ? 'primary-note' : ''}>
                  {note}
                </span>
              ))}
            </div>
            <div className="scale-degrees">
              {scaleDegrees.map((degree) => (
                <span key={degree}>{degree}</span>
              ))}
            </div>
            <div className="scale-metadata">
              <div className="metadata-block">
                <p className="metadata-label">Fórmula</p>
                <p>{formula}</p>
              </div>
              <div className="metadata-block">
                <p className="metadata-label">Color característico</p>
                <p>{characteristic}</p>
              </div>
            </div>
            <div className="explanation card-sm">
              <Sparkles size={18} />
              <p>
                {root} {mode.name} contiene las mismas notas que {parallel.reference.name}. Esto no significa que tenga el mismo centro tonal. {mode.name} se identifica por su color característico y la nota modificada respecto a {parallel.reference.name}.
              </p>
            </div>
          </div>
        </section>

        <section className="card" id="modos">
          <div className="section-header">
            <div>
              <h2>Continuo modal</h2>
              <p>Cada modo baja una nota un semitono respecto al anterior.</p>
            </div>
            <div className="toggle-group">
              {['Lidio', 'Jónico', 'Mixolidio', 'Dórico', 'Eólico', 'Frigio', 'Locrio'].map((name) => (
                <button key={name} type="button" className={name.toLowerCase() === mode.name.toLowerCase() ? 'active' : ''} onClick={() => setScaleKey(name.toLowerCase() as ScaleKey)}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          <ModeComparer root={root} currentKey={scaleKey} />
        </section>

        <section className="card" id="armonia">
          <div className="section-header">
            <div>
              <h2>Armonización</h2>
              <p>Triadas y tétradas construidas desde la escala seleccionada.</p>
            </div>
            <div className="toggle-group">
              <button type="button" className={!showTetrads ? 'active' : ''} onClick={() => setShowTetrads(false)}>
                Triadas
              </button>
              <button type="button" className={showTetrads ? 'active' : ''} onClick={() => setShowTetrads(true)}>
                Tétradas
              </button>
            </div>
          </div>
          <HarmonyTable harmony={harmony} scaleKey={scaleKey} root={root} />
        </section>

        <section className="card" id="fretboard">
          <div className="section-header">
            <div>
              <h2>Mástil de guitarra</h2>
              <p>Notas de la escala en afinación estándar sobre 12 trastes.</p>
            </div>
            <div className="toggle-group">
              {['notes', 'degrees', 'both'].map((modeOption) => (
                <button key={modeOption} type="button" className={labelMode === modeOption ? 'active' : ''} onClick={() => setLabelMode(modeOption as 'notes' | 'degrees' | 'both')}>
                  {modeOption === 'notes' ? 'Notas' : modeOption === 'degrees' ? 'Grados' : 'Ambos'}
                </button>
              ))}
            </div>
          </div>
          <Fretboard scaleNotes={scaleNotes} root={root} scaleKey={scaleKey} labelMode={labelMode} />
        </section>

        <section className="grid-two card" id="intervalos">
          <div>
            <h2>Intervalos</h2>
            <p>Comprueba el número de semitonos y la calidad del intervalo.</p>
            <IntervalTool />
          </div>
          <div>
            <h2>Acordes</h2>
            <p>Consulta fórmulas y notas de acordes desde su raíz.</p>
            <ChordTool />
          </div>
        </section>

        <section className="card" id="circulo">
          <div className="section-header">
            <div>
              <h2>Círculo de quintas</h2>
              <p>Relación entre modos y tonalidades vecinas.</p>
            </div>
          </div>
          <CircleOfFifths currentRoot={root} onSelect={(value) => setRoot(value)} />
          <div className="circle-explanation">
            <p>
              {root} {mode.name} se conecta con {circleMode.root} mayor. El círculo muestra cómo los modos se desplazan en sostenidos y bemoles mientras mantiene la misma familia tonal.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p>Lisa v1.0 · herramienta de teoría musical sin backend</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
