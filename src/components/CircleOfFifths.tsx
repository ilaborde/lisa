import { NOTE_NAMES } from '../music/notes';
import { getScaleNotes, getScaleByKey, ScaleKey } from '../music/scales';

const CIRCLE = [
  { root: 'C', label: 'C' },
  { root: 'G', label: 'G' },
  { root: 'D', label: 'D' },
  { root: 'A', label: 'A' },
  { root: 'E', label: 'E' },
  { root: 'B', label: 'B' },
  { root: 'F#', label: 'F#' },
  { root: 'Db', label: 'Db' },
  { root: 'Ab', label: 'Ab' },
  { root: 'Eb', label: 'Eb' },
  { root: 'Bb', label: 'Bb' },
  { root: 'F', label: 'F' },
] as const;

type CircleOfFifthsProps = {
  currentRoot: string;
  onSelect: (root: string) => void;
};

export function CircleOfFifths({ currentRoot, onSelect }: CircleOfFifthsProps) {
  const selected = CIRCLE.find((item) => item.root === currentRoot) ?? CIRCLE[0];

  return (
    <div className="circle-card">
      <div className="circle-grid">
        {CIRCLE.map((entry) => (
          <button key={entry.root} type="button" className={`circle-item ${entry.root === selected.root ? 'active' : ''}`} onClick={() => onSelect(entry.root)}>
            <span>{entry.label}</span>
          </button>
        ))}
      </div>
      <div className="circle-description">
        <p>Selecciona una tonalidad para explorar las relaciones de quinta. Los modos conectan cada nota con su hermana mayor y menor.</p>
      </div>
    </div>
  );
}
