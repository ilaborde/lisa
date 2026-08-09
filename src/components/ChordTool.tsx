import { useMemo, useState } from 'react';
import { ALL_CHORD_TYPES, buildChord, type ChordQualities } from '../music/chords';
import { NOTE_NAMES } from '../music/notes';

export function ChordTool() {
  const [root, setRoot] = useState('C');
  const [type, setType] = useState<ChordQualities>('mayor');
  const chord = useMemo(() => buildChord(root, type), [root, type]);

  if (!chord) {
    return null;
  }

  return (
    <div className="tool-card">
      <div className="tool-row">
        <label>
          Raíz
          <select value={root} onChange={(event) => setRoot(event.target.value)}>
            {NOTE_NAMES.filter((note) => !note.includes('/')).map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select value={type} onChange={(event) => setType(event.target.value as ChordQualities)}>
            {ALL_CHORD_TYPES.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-result">
        <p>{chord.label}</p>
        <p>{chord.degrees.join(' ')}</p>
        <p>{chord.notes.join(' ')}</p>
      </div>
    </div>
  );
}
