import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmModal from '../../src/Components/Shared/Modals/DeletionConfirmModal'

import '@testing-library/jest-dom'


describe('DeleteConfirmModal Component', () => {
 

  it('closes the modal when the cancel button is clicked', () => {
    const onClose = vi.fn(); // Use Vitest's vi.fn() for mock functions
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={() => {}}
      />
    );

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the buttons correctly', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    );

    const cancelButton = screen.getByTestId('cancel-button');
    const deleteButton = screen.getByTestId('delete-button');

    expect(cancelButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('closes the modal when the cancel button is clicked', () => {
    const onClose = vi.fn(); // Use Vitest's vi.fn() for mock functions
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={() => {}}
      />
    );

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when the delete button is clicked', () => {
    const onConfirm = vi.fn(); // Use Vitest's vi.fn() for mock functions
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
