import React from 'react';
import {render, screen} from '@testing-library/react';
import {NoteListItem} from '../../../components/lists/NoteListItem';
import {OperationNote} from '../../../types/operation';
import {Builder} from "builder-pattern";

describe('NoteListItem', () => {
    it('renders note with divider when not last', () => {
        const note = buildNote(NOTE_CONTENT, NOTE_CREATED_AT);

        render(<NoteListItem note={note} isLast={false}/>);

        expect(screen.getByTestId('note-list-item')).toBeInTheDocument();
        expect(screen.getByTestId('note-text')).toHaveTextContent(NOTE_CONTENT);
        expect(screen.getByTestId('note-text')).toHaveTextContent(NOTE_CREATED_AT);
        expect(screen.getByTestId('note-divider')).toBeInTheDocument();
    });

    it('renders note without divider when last', () => {
        const note = buildNote(NOTE_CONTENT, NOTE_CREATED_AT);

        render(<NoteListItem note={note} isLast={true}/>);

        expect(screen.getByTestId('note-list-item')).toBeInTheDocument();
        expect(screen.getByTestId('note-text')).toHaveTextContent(NOTE_CONTENT);
        expect(screen.getByTestId('note-text')).toHaveTextContent(NOTE_CREATED_AT);
        expect(screen.queryByTestId('note-divider')).toBeNull();
    });

    it('renders different notes correctly', () => {
        const firstContent = 'Initial assessment complete';
        const secondContent = 'Patient notified about results';

        const firstNote = buildNote(firstContent, '2025-03-01T09:00:00');
        const secondNote = buildNote(secondContent, '2025-03-02T11:30:00');

        render(
            <>
                <NoteListItem note={firstNote} isLast={false}/>
                <NoteListItem note={secondNote} isLast={true}/>
            </>
        );

        const items = screen.getAllByTestId('note-list-item');
        expect(items.length).toBe(2);

        expect(screen.getAllByTestId('note-text')[0]).toHaveTextContent(firstContent);
        expect(screen.getAllByTestId('note-text')[0]).toHaveTextContent('2025-03-01T09:00:00');
        expect(screen.getAllByTestId('note-text')[1]).toHaveTextContent(secondContent);
        expect(screen.getAllByTestId('note-text')[1]).toHaveTextContent('2025-03-02T11:30:00');
        expect(screen.getAllByTestId('note-divider').length).toBe(1);
    });

    const NOTE_CONTENT = 'Follow-up required';
    const NOTE_CREATED_AT = '2025-02-01T10:00:00';
    const buildNote = (content: string, createdAt: string): OperationNote =>
        Builder<OperationNote>()
            .content(content)
            .createdAt(createdAt)
            .build();
});

