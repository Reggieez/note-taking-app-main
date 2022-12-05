import React, { useState, useEffect, ChangeEvent } from 'react';
import NotesAPI from './api';
import { NodeProps } from './types';

const NotesView: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(undefined);
  const [activeNote, setActiveNote] = useState({});
  const [body, setBody] = useState(undefined);
  const [notes, setNotes] = useState([]);

  const onNoteSave = () => {
    const updatedTitle = title.trim();
    const updatedBody = body.trim();
    onNoteEdit(updatedTitle, updatedBody);
  };

  const onNoteSelect = (noteId: number) => {
    const selectedNote = notes.find((note: NodeProps) => note.id === noteId);
    updateActiveNote(selectedNote);
  };
  const onNoteAdd = () => {
    const newNote = {
      title: '新建笔记',
      body: '开始记录...',
    };

    NotesAPI.saveNote(newNote);
    refreshNotes();
  };

  const onNoteEdit = (title: string, body: string) => {
    NotesAPI.saveNote({
      id: activeNote.id,
      title,
      body,
    });

    refreshNotes();
  };
  const onNoteDelete = (noteId: number) => {
    const doDelete = confirm('确认要删除该笔记吗?');

    if (doDelete) {
      NotesAPI.deleteNote(noteId);
      refreshNotes();
    }
  };

  const refreshNotes = () => {
    const _notes = NotesAPI.getAllNotes();
    setNotes(_notes);
    setVisible(_notes.length > 0);
    if (_notes.length > 0) {
      updateActiveNote(_notes[0]);
    }
  };

  useEffect(() => {
    refreshNotes();
  }, []);

  const creatNoteList = () => {
    const MAX_BODY_LENGTH = 60;
    return notes.map(({ id, title, body, updated }: NodeProps) => (
      <div
        className={`notes__list-item ${
          id === activeNote.id ? 'notes__list-item--selected' : ''
        }`}
        key={id}
        onClick={() => onNoteSelect(id)}
      >
        <span className="notes__delete_btn" onClick={() => onNoteDelete(id)}>
          ✖️
        </span>
        <div className="notes__small-title">{title}</div>
        <div className="notes__small-body">
          {body.substring(0, MAX_BODY_LENGTH)}
          {body.length > MAX_BODY_LENGTH ? '...' : ''}
        </div>
        <div className="notes__small-updated">
          {new Date(updated).toLocaleString(undefined, {
            dateStyle: 'full',
            timeStyle: 'short',
          })}
        </div>
      </div>
    ));
  };

  const updateActiveNote = (note: NodeProps) => {
    setTitle(note.title);
    setBody(note.body);
    setActiveNote(note);
    setVisible(true);
  };

  const onTitleChange = (event: ChangeEvent) => {
    setTitle(event.target.value);
  };

  const onBodyChange = (event: ChangeEvent) => {
    console.log(event);
    setBody(event.target.value);
  };

  return (
    <div className="notes">
      <div className="notes__sidebar">
        <button className="notes__add" type="button" onClick={onNoteAdd}>
          添加新的笔记 📒
        </button>
        <div className="notes__list">{creatNoteList()}</div>
      </div>
      {visible && (
        <div className="notes__preview">
          <input
            className="notes__title"
            type="text"
            value={title}
            placeholder="新笔记..."
            onChange={onTitleChange}
          />
          <textarea
            className="notes__body"
            placeholder="编辑笔记..."
            value={body}
            onChange={onBodyChange}
          />
          <div className="notes__btns">
            <button className="notes__save" type="button" onClick={onNoteSave}>
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesView;
