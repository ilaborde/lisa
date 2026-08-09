import { useMemo, useState } from 'react';
import { buildFretboard, FretboardCell, STANDARD_TUNING } from '../music/fretboard';
import { getIntervalBetween } from '../music/intervals';

type FretboardProps = {
  root: string;
  scaleKey: string;
  labelMode: 'notes' | 'degrees' | 'both';
  scaleNotes?: string[];
  onLabelModeChange?: (mode: 'notes' | 'degrees' | 'both') => void;
};

export function Fretboard({ root, scaleKey, labelMode, onLabelModeChange }: FretboardProps) {
  const [selected, setSelected] = useState<FretboardCell | null>(null);
  const [localLabelMode, setLocalLabelMode] = useState<'notes'|'degrees'|'both'>(labelMode ?? 'notes');
  const board = useMemo(() => buildFretboard(root, scaleKey, labelMode), [root, scaleKey, labelMode]);

  // board is array of 6 strings, each with 13 frets
  const frets = 13;

  function handleSelect(cell: FretboardCell) {
    setSelected(cell);
  }

  function handleLabelModeChange(mode: 'notes'|'degrees'|'both') {
    setLocalLabelMode(mode);
    if (onLabelModeChange) onLabelModeChange(mode);
  }

  return (
    <div className="fretboard-card">
      <div>
        <div className="fretboard-controls">
          <div className="toggle-group">
            {/* Toggle buttons can be wired by parent; kept visual here */}
          </div>
        </div>

        <div className="fretboard-scroll">
          <div className="fretboard">
            <div className="fret-numbers">
              {Array.from({ length: frets }, (_, i) => (
                <div key={i} className="fret-number">{i}</div>
              ))}
            </div>

            <div className="neck">
              <div className="nut" />
              {/* Render frets columns */}
              {Array.from({ length: frets }, (_, fret) => {
                const isMarkerFret = [3,5,7,9].includes(fret);
                const isDoubleMarker = fret === 12;
                return (
                <div key={fret} className="fret" style={{ minHeight: '100%' }}>
                  {/* For each string, render a note position */}
                  {board.map((stringRow, stringIndex) => {
                    const cell = stringRow[fret];
                    const topPercent = (stringIndex / (board.length - 1)) * 100;
                    return (
                      <div key={`${stringIndex}-${fret}`} style={{ position: 'relative', height: `${100 / board.length}%` }}>
                        <div className="string-line" style={{ top: `${topPercent}%`, position: 'absolute', left: 0, right: 0 }} />
                        {/* Note dot */}
                        <button
                          type="button"
                          onClick={() => handleSelect(cell)}
                          className={`note-dot ${cell.isRoot ? 'note-root' : cell.isCharacteristic ? 'note-characteristic' : cell.inScale ? 'note-scale' : 'note-out'}`}
                          style={{ top: `calc(${topPercent}% + 6px)` }}
                          title={`${cell.note} ${cell.degree ?? ''}`}
                        >
                          {localLabelMode === 'notes' ? cell.note : localLabelMode === 'degrees' ? cell.degree ?? '' : `${cell.note}`}
                        </button>
                      </div>
                    );
                  })}

                  {/* fret marker */}
                  {(isMarkerFret || isDoubleMarker) && (
                    <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
                      {isDoubleMarker ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <div className="fret-marker" />
                          <div className="fret-marker" />
                        </div>
                      ) : (
                        <div className="fret-marker" />
                      )}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fretboard-info">
        {selected ? (
          <div>
            <p className="metadata-label">Posición seleccionada</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selected.note} — {selected.degree ?? 'Fuera de escala'}</p>
            {selected.degree ? (
              <div>
                <p>{selected.note} → {getIntervalBetween(root, selected.note).description}</p>
              </div>
            ) : (
              <p>Nota fuera de la escala seleccionada.</p>
            )}
          </div>
        ) : (
          <div>
            <p className="metadata-label">Toca una nota del mástil</p>
            <p>Haz click en una posición para ver detalles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
