import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {OperationNotes} from '../../../components/lists/OperationNotes';
import {OperationNote} from '../../../types/operation';
import {Builder} from 'builder-pattern';

describe('OperationNotes', () => {
    const onAddNote = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when no notes', () => {
        render(<OperationNotes notes={[]} onAddNote={onAddNote}/>);

        expect(screen.getByText('Notes')).toBeInTheDocument();
        expect(screen.getByText('No notes yet')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add note/i})).toBeInTheDocument();
    });

    it('renders notes list when notes exist', () => {
        const notes = [
            buildNote('First note content', '2025-02-01T10:00:00'),
            buildNote('Second note content', '2025-02-01T11:00:00')
        ];

        render(<OperationNotes notes={notes} onAddNote={onAddNote}/>);

        expect(screen.getByText('Notes')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add note/i})).toBeInTheDocument();
        expect(screen.queryByText('No notes yet')).not.toBeInTheDocument();

        const noteItems = screen.getAllByTestId('note-list-item');
        expect(noteItems).toHaveLength(2);
    });

    it('calls onAddNote when Add Note button is clicked', () => {
        render(<OperationNotes notes={[]} onAddNote={onAddNote}/>);

        const addButton = screen.getByRole('button', {name: /add note/i});
        fireEvent.click(addButton);

        expect(onAddNote).toHaveBeenCalledTimes(1);
    });

    it('renders multiple notes with correct isLast prop', () => {
        const notes = [
            buildNote('First note', '2025-02-01T10:00:00'),
            buildNote('Second note', '2025-02-01T11:00:00'),
            buildNote('Third note', '2025-02-01T12:00:00')
        ];

        render(<OperationNotes notes={notes} onAddNote={onAddNote}/>);

        const noteItems = screen.getAllByTestId('note-list-item');
        expect(noteItems).toHaveLength(3);

        const dividers = screen.getAllByTestId('note-divider');
        expect(dividers).toHaveLength(2);
    });

    const buildNote = (content: string, createdAt: string): OperationNote =>
        Builder<OperationNote>()
            .content(content)
            .createdAt(createdAt)
            .build();
});
