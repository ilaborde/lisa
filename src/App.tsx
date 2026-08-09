import { useMemo, useState, useEffect } from 'react';
import {
  ALL_SCALES,
  NOTE_NAMES,
  ScaleKey,
  ScaleRecord,
  getChordFromRoot,
  getModeByKey,
  getParallelScaleInfo,
  getScaleDegreeNames,
  getScaleFormula,
  getScaleNotes,
  getScaleCharacteristic,
  getModeTransition,
} from './music/theory';
import { getIntervalBetween } from './music/intervals';
import { Fretboard } from './components/Fretboard';
import { HarmonyTable } from './components/HarmonyTable';
import { CircleOfFifths } from './components/CircleOfFifths';
import { IntervalTool } from './components/IntervalTool';
import { ChordTool } from './components/ChordTool';
import { ModeComparer } from './components/ModeComparer';
import type { ChordRecord } from './music/chords';

const ROOT_OPTIONS = NOTE_NAMES.filter((note) => !note.includes('/'));
const MODE_OPTIONS: Array<ScaleRecord> = ALL_SCALES;

function App() {
  const [root, setRoot] = useState('G');
  const [scaleKey, setScaleKey] = useState<ScaleKey>('mixolydian');
  const [showTetrads, setShowTetrads] = useState(false);
  const [labelMode, setLabelMode] = useState<'notes' | 'degrees' | 'both'>('both');
  const [selectedChordLabel, setSelectedChordLabel] = useState('');

  const mode = useMemo(() => getModeByKey(scaleKey), [scaleKey]);
  const scaleNotes = useMemo(() => getScaleNotes(root, scaleKey), [root, scaleKey]);
  const scaleDegrees = useMemo(() => getScaleDegreeNames(scaleKey), [scaleKey]);
  const formula = useMemo(() => getScaleFormula(scaleKey), [scaleKey]);
  const characteristic = useMemo(() => getScaleCharacteristic(scaleKey), [scaleKey]);
  const parallel = useMemo(() => getParallelScaleInfo(root, scaleKey), [root, scaleKey]);
  const harmony = useMemo(() => getChordFromRoot(root, scaleKey, showTetrads), [root, scaleKey, showTetrads]);
  const circleMode = useMemo(() => getModeTransition(root), [root]);

  useEffect(() => {
    if (!harmony.length) {
      setSelectedChordLabel('');
      return;
    }

    if (!harmony.some((item) => item.label === selectedChordLabel)) {
      setSelectedChordLabel(harmony[0].label);
    }
  }, [harmony, selectedChordLabel]);

  const selectedHarmony = useMemo(
    () => harmony.find((item) => item.label === selectedChordLabel) ?? harmony[0] ?? null,
    [harmony, selectedChordLabel],
  );

  function formatIntervalText(chord: ChordRecord) {
    if (chord.notes.length < 3) return '';
    const rootNote = chord.notes[0];
    const third = chord.notes[1];
    const fifth = chord.notes[2];
    const intervalThird = getIntervalBetween(rootNote, third);
    const intervalFifth = getIntervalBetween(rootNote, fifth);
    return `${rootNote} → ${third} = ${intervalThird.semitones} semitonos (${intervalThird.description}) · ${rootNote} → ${fifth} = ${intervalFifth.semitones} semitonos (${intervalFifth.description})`;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-note">♫</div>
          <div>
            <div className="brand-title">Lisa</div>
            <div className="brand-sub">teoría musical</div>
          </div>
        </div>

        <nav className="nav" aria-label="Navegación principal">
          <a className="nav-item active" href="#explorar">
            <div className="nav-icon">⌘</div>
            <div>
              <div className="nav-title">Explorar</div>
              <div className="nav-sub">Escalas, modos y mástil</div>
            </div>
          </a>
          <a className="nav-item" href="#modos">
            <div className="nav-icon">☆</div>
            <div>
              <div className="nav-title">Modos</div>
              <div className="nav-sub">Comparador modal</div>
            </div>
          </a>
          <a className="nav-item" href="#armonia">
            <div className="nav-icon">♮</div>
            <div>
              <div className="nav-title">Armonía</div>
              <div className="nav-sub">Armonización de la escala</div>
            </div>
          </a>
          <a className="nav-item" href="#intervalos">
            <div className="nav-icon">♬</div>
            <div>
              <div className="nav-title">Acordes</div>
              <div className="nav-sub">Constructor y consulta</div>
            </div>
          </a>
          <a className="nav-item" href="#circulo">
            <div className="nav-icon">◉</div>
            <div>
              <div className="nav-title">Intervalos</div>
              <div className="nav-sub">Calculadora de intervalos</div>
            </div>
          </a>
        </nav>

        <div className="sidebar-meta">
          <p>Root: {root}</p>
          <p>Modo: {mode.name}</p>
          <p>Escala base: {parallel.reference.name}</p>
        </div>

        <div className="sidebar-bottom">
          <span>◔</span>
          <span>⚙</span>
          <span style={{ fontSize: '14px' }}>ES</span>
        </div>
      </aside>

      <main className="main">
        <div className="shell">
          <h1>Explorar</h1>

          <section className="card controls" id="explorar">
            <div className="field">
              <label>Tónica</label>
              <div className="select-wrap">
                <select value={root} onChange={(event) => setRoot(event.target.value)}>
                  {ROOT_OPTIONS.map((note) => (
                    <option key={note} value={note}>
                      {note}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Escala / Modo</label>
              <div className="select-wrap">
                <select value={scaleKey} onChange={(event) => setScaleKey(event.target.value as ScaleKey)}>
                  {MODE_OPTIONS.map((scale) => (
                    <option key={scale.key} value={scale.key}>
                      {scale.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" className="btn">🔊 Sonido</button>
            <button type="button" className="btn">💡 Entender el modo</button>
          </section>

          <section className="card scale-card">
            <div className="scale-block">
              <div className="scale-title">{root} {mode.name}</div>
              <div className="scale-desc">{mode.description}</div>
              <div className="pill">Color característico: {characteristic}</div>
            </div>

            <div className="scale-block">
              <div className="notes-line">
                {scaleNotes.map((note, index) => (
                  <div key={`${note}-${index}`}>
                    <div className={`note-big ${index === 0 ? 'root-note' : note === characteristic ? 'char-note' : ''}`}>{note}</div>
                    <div className={`degree ${scaleDegrees[index] === characteristic ? 'accent' : ''}`}>{scaleDegrees[index]}</div>
                  </div>
                ))}
              </div>
              <div className="formula">Fórmula: {formula}</div>
            </div>

            <div className="scale-block">
              <div className="relation-title">Relación con escala mayor</div>
              <div className="relation-text">
                {root} {mode.name} contiene las mismas notas que <span className="accent">{parallel.reference.name}</span>.
                <br />
                Mismas notas, distinto centro tonal.
              </div>
            </div>
          </section>

          <section className="card fret-card" id="fretboard">
            <div className="fret-head">
              <div>
                <h2>Mástil de guitarra</h2>
                <div className="fret-sub">Afinación estándar (E A D G B E) • 12 trastes</div>
              </div>
              <div className="segmented">
                {['notes', 'degrees', 'both'].map((modeOption) => (
                  <button key={modeOption} type="button" className={labelMode === modeOption ? 'active' : ''} onClick={() => setLabelMode(modeOption as 'notes' | 'degrees' | 'both')}>
                    {modeOption === 'notes' ? 'Notas' : modeOption === 'degrees' ? 'Grados' : 'Ambos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="fret-wrap">
              <div className="string-labels">
                {['E', 'B', 'G', 'D', 'A', 'E'].map((stringName) => (
                  <span key={stringName}>{stringName}</span>
                ))}
              </div>
              <div className="fret-scroll">
                <Fretboard root={root} scaleKey={scaleKey} labelMode={labelMode} />
              </div>
            </div>

            <div className="legend">
              <span className="legend-item"><span className="legend-dot lg-root" />Tónica</span>
              <span className="legend-item"><span className="legend-dot lg-char" />Nota característica</span>
              <span className="legend-item"><span className="legend-dot lg-scale" />Notas de la escala</span>
              <span className="legend-item"><span className="legend-dot lg-other" />Otras notas</span>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="card harm-card" id="armonia">
              <div className="harm-head">
                <div>
                  <h2>Armonización <span className="harm-subtle">({showTetrads ? 'Tétradas' : 'Triadas'})</span></h2>
                  <div className="harm-sub">Triadas y tétradas construidas desde la escala seleccionada.</div>
                </div>
                <div className="mini-tabs">
                  <button type="button" className={!showTetrads ? 'active' : ''} onClick={() => setShowTetrads(false)}>Triadas</button>
                  <button type="button" className={showTetrads ? 'active' : ''} onClick={() => setShowTetrads(true)}>Tétradas</button>
                </div>
              </div>
              <HarmonyTable
                harmony={harmony}
                scaleKey={scaleKey}
                root={root}
                selectedChordLabel={selectedChordLabel}
                onSelectChord={(label) => setSelectedChordLabel(label)}
              />
            </div>

            <div className="card detail-card">
              <h2>Detalle del acorde</h2>
              {selectedHarmony ? (
                <div className="detail-layout">
                  <div>
                    <div className="big-chord">{selectedHarmony.label}</div>
                    <div className="degree-label">{selectedHarmony.degreeName} grado</div>
                  </div>
                  <div className="details">
                    <div className="line"><strong>Notas:</strong> {selectedHarmony.notes.join(' ')}</div>
                    <div className="line"><strong>Fórmula:</strong> {selectedHarmony.degrees.join(' ')}</div>
                    <div className="line"><strong>Intervalos:</strong> {selectedHarmony.intervals.join(' · ')}</div>
                  </div>
                  <div className="mini-diagram">
                    <span className="mini-dot d1" />
                    <span className="mini-dot d2" />
                  </div>
                </div>
              ) : (
                <p>Haz click en una carta de acorde para ver sus notas y su intervalo desde la raíz.</p>
              )}
            </div>
          </section>

          <section className="card" id="modos">
            <div className="section-header">
              <div>
                <h2>Continuo modal</h2>
                <p>Cada modo baja una nota un semitono respecto al anterior.</p>
              </div>
            </div>
            <ModeComparer root={root} currentKey={scaleKey} />
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

          <footer className="footer">
            <p>Lisa v1.0 · herramienta de teoría musical sin backend</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
