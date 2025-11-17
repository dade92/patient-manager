import React from 'react';
import {render, screen} from '@testing-library/react';
import {AssetListItem} from '../../../components/lists/AssetListItem';

describe('AssetListItem', () => {
    it('renders asset link with correct filename', () => {
        render(<AssetListItem asset={ASSET_FILENAME}/>);

        const link = screen.getByTestId('asset-link');

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/files?filename=${ASSET_FILENAME}`);
    });

    it('renders chip with asset label', () => {
        render(<AssetListItem asset={ASSET_FILENAME}/>);

        const chip = screen.getByTestId('asset-chip');

        expect(chip).toBeInTheDocument();
        expect(chip).toHaveTextContent(ASSET_FILENAME);
    });

    it('opens link in new tab', () => {
        render(<AssetListItem asset={ASSET_FILENAME}/>);

        const link = screen.getByTestId('asset-link');

        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    const ASSET_FILENAME = 'file1.pdf';
});