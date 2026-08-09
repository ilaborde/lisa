import { type ChordRecord } from '../music/chords';
import { Music2 } from 'lucide-react';

type HarmonyTableProps = {
  harmony: ChordRecord[];
  root: string;
  scaleKey: string;
};

export function HarmonyTable({ harmony, root, scaleKey }: HarmonyTableProps) {
  return (
    <div className="harmony-grid">
      {harmony.map((chord) => (
        <button key={chord.label} type="button" className="harmony-card">
          <div className="harmony-card-title">
            <span>{chord.label}</span>
            <Music2 size={16} />
          </div>
          <p className="harmony-notes">{chord.notes.join(' ')}</p>
          <p className="harmony-degrees">{chord.degrees.join(' ')}</p>
          <p className="harmony-intervals">{chord.intervals.join(' · ')}</p>
          <p className="harmony-subtitle">{chord.degreeName} grado de {root} {scaleKey}</p>
        </button>
      ))}
    </div>
  );
}
