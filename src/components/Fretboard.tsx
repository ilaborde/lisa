import { useMemo, useState } from 'react';
import { buildFretboard, type FretboardCell } from '../music/fretboard';
import { getIntervalBetween } from '../music/intervals';
import type { ScaleKey } from '../music/scales';

type FretboardProps = {
  root: string;
  scaleKey: ScaleKey;
  labelMode: 'notes' | 'degrees' | 'both';
};

const MARKER_FRETS = [3, 5, 8, 10, 12];

export function Fretboard({ root, scaleKey, labelMode }: FretboardProps) {
  const [selected, setSelected] = useState<FretboardCell | null>(null);
  const board = useMemo(() => buildFretboard(root, scaleKey, labelMode), [root, scaleKey, labelMode]);
  const strings = [...board].reverse();
  const frets = 13;

  return (
    <div className="fretboard-card">
      <div className="fretboard-frame">
        <div className="fretboard">
          {strings.map((stringRow, stringIndex) => (
            <div key={stringIndex} className="string-row">
              {stringRow.slice(1, 13).map((cell) => {
                const statusClass = cell.isRoot
                  ? 'root'
                  : cell.isCharacteristic
                  ? 'char'
                  : cell.inScale
                  ? 'scale'
                  : '';

                const showNote = labelMode !== 'degrees';
                const showDegree = labelMode !== 'notes';
                const noteText = cell.note.replace('#', '♯');

                return (
                  <button
                    key={cell.fret}
                    type="button"
                    className="fret-cell"
                    onClick={() => setSelected(cell)}
                    aria-label={`${cell.note} ${cell.degree ?? 'Posición fuera de escala'}`}
                  >
                    <div className={`marker ${statusClass}`}>
                      {showNote && <span className="marker-note">{noteText}</span>}
                      {showDegree && cell.degree ? <span className="marker-degree">{cell.degree}</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="fret-numbers">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={MARKER_FRETS.includes(index + 1) ? 'dot' : ''}>
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="fretboard-info">
        <div className="fretboard-info-card">
          {selected ? (
            <>
              <p className="metadata-label">Posición seleccionada</p>
              <p className="fretboard-selection-title">
                {selected.note} — {selected.degree ?? 'Fuera de escala'}
              </p>
              <p>{selected.degree ? `${selected.note} → ${getIntervalBetween(root, selected.note).description}` : 'Nota fuera de la escala seleccionada.'}</p>
            </>
          ) : (
            <>
              <p className="metadata-label">Toca una nota del mástil</p>
              <p>Haz click en cualquier casilla para ver la información de la posición.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
