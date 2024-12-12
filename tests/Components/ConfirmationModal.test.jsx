import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../../src/Components/Shared/Modals/ConfirmationModal'


describe('ConfirmationModal Component', () => {
   

  it('closes the modal when the cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmationModal
        show={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmationModal
        show={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    fireEvent.click(screen.getByTestId('confirm-button'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
