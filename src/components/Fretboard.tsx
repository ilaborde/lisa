import { useMemo, useState } from 'react';
import { buildFretboard, type FretboardCell } from '../music/fretboard';
import { getIntervalBetween } from '../music/intervals';
import type { ScaleKey } from '../music/scales';

type FretboardProps = {
  root: string;
  scaleKey: ScaleKey;
  labelMode: 'notes' | 'degrees' | 'both';
};

const MARKER_FRETS = [3, 5, 7, 9, 12];

export function Fretboard({ root, scaleKey, labelMode }: FretboardProps) {
  const [selected, setSelected] = useState<FretboardCell | null>(null);
  const board = useMemo(() => buildFretboard(root, scaleKey, labelMode), [root, scaleKey, labelMode]);
  const strings = [...board].reverse();
  const frets = 13;

  return (
    <div className="fretboard-card">
      <div className="fretboard-frame">
        <div className="fretboard-titles">
          <div className="fretboard-gap" />
          {Array.from({ length: frets }, (_, fret) => (
            <div key={fret} className={fret === 0 ? 'fret-number nut-number' : 'fret-number'}>
              {fret}
            </div>
          ))}
        </div>

        <div className="fretboard-neck">
          {strings.map((stringRow, stringIndex) => (
            <div key={stringIndex} className="string-row">
              <div className="string-name">{stringRow[0].stringName}</div>
              {stringRow.map((cell) => {
                const statusClass = cell.isRoot
                  ? 'note-root'
                  : cell.isCharacteristic
                  ? 'note-characteristic'
                  : cell.inScale
                  ? 'note-scale'
                  : 'note-out';

                const showNote = labelMode !== 'degrees';
                const showDegree = labelMode !== 'notes';

                return (
                  <button
                    key={cell.fret}
                    type="button"
                    className={`fret-cell ${statusClass}`}
                    onClick={() => setSelected(cell)}
                    aria-label={`${cell.note} ${cell.degree ?? 'Posición fuera de escala'}`}
                  >
                    <span className="note-dot">
                      <span className="note-label note-name">{showNote ? cell.note : ''}</span>
                      {showDegree ? <span className="note-label note-degree">{cell.degree ?? ''}</span> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          <div className="fret-markers">
            <div className="fretboard-gap" />
            {Array.from({ length: frets }, (_, fret) => {
              const isMarker = MARKER_FRETS.includes(fret);
              return (
                <div key={fret} className="marker-cell">
                  {fret === 12 ? (
                    <>
                      <span className="marker-dot" />
                      <span className="marker-dot" />
                    </>
                  ) : isMarker ? (
                    <span className="marker-dot" />
                  ) : null}
                </div>
              );
            })}
          </div>
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
