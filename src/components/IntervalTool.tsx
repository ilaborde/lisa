import { useMemo, useState } from 'react';
import { NOTE_NAMES } from '../music/notes';
import { getIntervalBetween } from '../music/intervals';

export function IntervalTool() {
  const [noteA, setNoteA] = useState('C');
  const [noteB, setNoteB] = useState('E');
  const interval = useMemo(() => getIntervalBetween(noteA, noteB), [noteA, noteB]);

  return (
    <div className="tool-card">
      <div className="tool-row">
        <label>
          Nota 1
          <select value={noteA} onChange={(event) => setNoteA(event.target.value)}>
            {NOTE_NAMES.filter((note) => !note.includes('/')).map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nota 2
          <select value={noteB} onChange={(event) => setNoteB(event.target.value)}>
            {NOTE_NAMES.filter((note) => !note.includes('/')).map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="tool-result">
        <p>{noteA} → {noteB}</p>
        <p>{interval.semitones} semitonos</p>
        <p>{interval.description}</p>
      </div>
    </div>
  );
}
