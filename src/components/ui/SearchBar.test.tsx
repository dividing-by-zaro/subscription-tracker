import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('should render with default placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search subscriptions...')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('should display current value', () => {
    render(<SearchBar value="Netflix" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Netflix')).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search subscriptions...');
    await user.type(input, 'test');

    expect(onChange).toHaveBeenCalledTimes(4); // Once per character
    expect(onChange).toHaveBeenLastCalledWith('test');
  });

  it('should render search icon', () => {
    const { container } = render(<SearchBar value="" onChange={vi.fn()} />);
    expect(container.querySelector('.search-icon')).toBeInTheDocument();
  });

  it('should update value on change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search subscriptions...');
    await user.clear(input);
    await user.type(input, 'Spotify');

    expect(onChange).toHaveBeenCalledWith('Spotify');
  });
});
