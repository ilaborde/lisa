import { getModeOrder, getScaleByKey, getScaleNotes, type ScaleKey } from '../music/scales';
import { getParallelScaleInfo } from '../music/theory';

type ModeComparerProps = {
  root: string;
  currentKey: ScaleKey;
};

const modeNames: ScaleKey[] = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];

export function ModeComparer({ root, currentKey }: ModeComparerProps) {
  const currentIndex = modeNames.indexOf(currentKey);
  const currentNotes = getScaleNotes(root, currentKey);
  const previous = modeNames[(currentIndex - 1 + modeNames.length) % modeNames.length];
  const next = modeNames[(currentIndex + 1) % modeNames.length];
  const previousNotes = getScaleNotes(root, previous);

  const changedNote = currentNotes.find((note, index) => note !== previousNotes[index]);

  return (
    <div className="mode-comparer">
      <div className="mode-comparer-grid">
        {modeNames.map((modeKey) => {
          const scale = getScaleByKey(modeKey);
          return (
            <div key={modeKey} className={`mode-chip ${modeKey === currentKey ? 'active' : ''}`}>
              <strong>{scale.name}</strong>
              <p>{getScaleNotes(root, modeKey).join(' ')}</p>
            </div>
          );
        })}
      </div>
      <div className="mode-change">
        <p>
          Cambio: <strong>{previousNotes.join(' ')}</strong> → <strong>{currentNotes.join(' ')}</strong>
        </p>
        {changedNote ? <p>Nota cambiada: {changedNote}</p> : null}
      </div>
      <div className="mode-sequence">
        <p>Lidio → Jónico → Mixolidio → Dórico → Eólico → Frigio → Locrio</p>
        <p>Cada paso baja una nota un semitono.</p>
      </div>
    </div>
  );
}
