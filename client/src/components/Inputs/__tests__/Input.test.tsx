import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" value="" setValue={() => {}} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const setValue = jest.fn();
    render(<Input label="Test Input" value="" setValue={setValue} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');
    
    expect(setValue).toHaveBeenCalled();
  });
});
