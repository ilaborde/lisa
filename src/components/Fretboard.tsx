import { useMemo, useState } from 'react';
import { buildFretboard } from '../music/fretboard';
import { getIntervalBetween } from '../music/intervals';

type FretboardProps = {
  root: string;
  scaleKey: string;
  labelMode: 'notes' | 'degrees' | 'both';
  scaleNotes: string[];
};

export function Fretboard({ root, scaleKey, labelMode, scaleNotes }: FretboardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const board = useMemo(() => buildFretboard(root, scaleKey, labelMode), [root, scaleKey, labelMode]);
  const selectedInfo = selected ? { note: selected, degree: board.flat().find((cell) => cell.note === selected)?.degree } : null;

  return (
    <div className="fretboard-card">
      <div className="fretboard-scroll">
        <div className="fretboard-grid">
          <div className="fretboard-header">
            <span>Cadena</span>
            {Array.from({ length: 13 }, (_, fret) => (
              <span key={fret}>{fret}</span>
            ))}
          </div>
          {board.map((stringRow) => (
            <div key={stringRow[0].stringName} className="fretboard-row">
              <span className="string-label">{stringRow[0].stringName}</span>
              {stringRow.map((cell) => {
                const content = labelMode === 'notes' ? cell.note : labelMode === 'degrees' ? cell.degree ?? '' : `${cell.note} ${cell.degree ?? ''}`;
                return (
                  <button
                    key={`${cell.stringName}-${cell.fret}`}
                    type="button"
                    className={`fret-cell ${cell.inScale ? 'in-scale' : 'out-scale'} ${cell.isRoot ? 'root-cell' : ''} ${cell.isCharacteristic ? 'characteristic-cell' : ''}`}
                    onClick={() => setSelected(cell.note)}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="fretboard-info">
        {selectedInfo ? (
          <div>
            <p className="metadata-label">Posición seleccionada</p>
            <p>{selectedInfo.note}</p>
            <p>{selectedInfo.degree ?? 'Fuera de escala'}</p>
            {selectedInfo.degree ? (
              <p>{getIntervalBetween(root, selectedInfo.note).description}</p>
            ) : (
              <p>Nota fuera de la escala seleccionada.</p>
            )}
          </div>
        ) : (
          <div>
            <p className="metadata-label">Toca una nota del mástil</p>
            <p>Verás su grado e intervalo relativo a la tónica.</p>
          </div>
        )}
      </div>
    </div>
  );
}
