import { type ChordRecord } from '../music/chords';

type HarmonyTableProps = {
  harmony: ChordRecord[];
  root: string;
  scaleKey: string;
  selectedChordLabel?: string;
  onSelectChord?: (label: string) => void;
};

function getChordColor(degreeName: string, quality: string) {
  if (degreeName === 'iii°') return 'orange';
  if (degreeName === 'I' || degreeName === 'IV' || degreeName === '♭VII') return 'purple';
  if (degreeName === 'ii') return 'blue';
  if (degreeName === 'v' || degreeName === 'vi') return 'cyan';
  return quality === 'disminuido' ? 'orange' : 'purple';
}

function getQualityLabel(quality: string) {
  if (quality === 'mayor') return 'Mayor';
  if (quality === 'menor') return 'Menor';
  if (quality === 'disminuido') return 'Disminuido';
  return quality;
}

export function HarmonyTable({ harmony, root, scaleKey, selectedChordLabel, onSelectChord }: HarmonyTableProps) {
  return (
    <div className="chords">
      {harmony.map((chord) => {
        const isActive = chord.label === selectedChordLabel;
        const colorClass = getChordColor(chord.degreeName, chord.quality);

        return (
          <button
            key={chord.label}
            type="button"
            className={`chord ${colorClass} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectChord?.(chord.label)}
          >
            <div className="name">{chord.label}</div>
            <div className="roman">{chord.degreeName}</div>
            <div className="quality">{getQualityLabel(chord.quality)}</div>
          </button>
        );
      })}
    </div>
  );
}
