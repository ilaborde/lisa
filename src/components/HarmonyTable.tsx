import { type ChordRecord } from '../music/chords';
import { Music2 } from 'lucide-react';

type HarmonyTableProps = {
  harmony: ChordRecord[];
  root: string;
  scaleKey: string;
  selectedChordLabel?: string;
  onSelectChord?: (label: string) => void;
};

export function HarmonyTable({ harmony, root, scaleKey, selectedChordLabel, onSelectChord }: HarmonyTableProps) {
  return (
    <div className="harmony-grid">
      {harmony.map((chord) => {
        const isActive = chord.label === selectedChordLabel;
        return (
          <button
            key={chord.label}
            type="button"
            className={`harmony-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectChord?.(chord.label)}
          >
            <div className="harmony-card-title">
              <div>
                <strong>{chord.label}</strong>
                <span>{chord.degreeName}</span>
              </div>
              <Music2 size={16} />
            </div>
            <div className="harmony-card-body">
              <p className="harmony-notes">{chord.notes.join(' ')}</p>
              <p className="harmony-degrees">{chord.degrees.join(' ')}</p>
            </div>
            <p className="harmony-intervals">{chord.intervals.join(' · ')}</p>
            <p className="harmony-subtitle">Grado de {root} {scaleKey}</p>
          </button>
        );
      })}
    </div>
  );
}
