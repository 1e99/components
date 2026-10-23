import {fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {LocaleSelector} from './locale-selector';

const options = [
  {label: 'Português', languageTag: 'pt-BR', value: 'pt'},
  {label: 'English', languageTag: 'en', value: 'en'},
  {label: 'Español', languageTag: 'es', value: 'es'},
] as const;

describe('LocaleSelector', () => {
  it('requests a locale change without redirecting', () => {
    const onValueChange = vi.fn();

    render(
        <LocaleSelector
          label="Idioma"
          onValueChange={onValueChange}
          options={options}
          triggerAriaLabel="Idioma: Português"
          value="pt"
        />,
    );

    const trigger = screen.getByLabelText('Idioma: Português');
    const disclosure = trigger.parentElement;

    expect(trigger.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    expect(trigger).toHaveClass('select-none');
    expect(disclosure).toHaveClass('locale-disclosure');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    const portugueseButton = screen.getByRole('button', {name: 'Português'});
    const englishButton = screen.getByRole('button', {name: 'English'});

    expect(portugueseButton).toHaveAttribute('aria-pressed', 'true');
    expect(englishButton).toHaveAttribute('aria-pressed', 'false');
    expect(englishButton).toHaveClass('select-none');
    expect(englishButton).not.toHaveAttribute('aria-current');
    expect(englishButton).not.toHaveAttribute('href');

    fireEvent.click(trigger);
    expect(disclosure).toHaveAttribute('open');

    fireEvent.click(englishButton);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('en');
    expect(portugueseButton).toHaveAttribute('aria-pressed', 'true');
    expect(englishButton).toHaveAttribute('aria-pressed', 'false');
    expect(disclosure).not.toHaveAttribute('open');
  });

  it('renders the selection supplied by a controlled consumer', () => {
    function NavigationLanguageExample() {
      const [value, setValue] = useState('pt');

      return (
        <>
          <output>{value}</output>
          <LocaleSelector
            label="Idioma"
            onValueChange={setValue}
            options={options}
            triggerAriaLabel={`Idioma: ${value === 'pt' ? 'Português' : 'English'}`}
            value={value}
          />
        </>
      );
    }

    render(<NavigationLanguageExample />);

    fireEvent.click(screen.getByLabelText('Idioma: Português'));
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    expect(screen.getByRole('status')).toHaveTextContent('en');
    expect(screen.getByLabelText('Idioma: English')).toBeVisible();
    expect(screen.getByRole('button', {name: 'English'})).toHaveAttribute('aria-pressed', 'true');
  });

  it.each([
    ['standard', 'w-full', 'min-h-12'],
    ['compact', 'w-auto', 'h-12'],
    ['compact-mobile', 'w-auto', 'h-12'],
  ] as const)('keeps the %s density used by the curriculum', (density, widthClass, heightClass) => {
    render(
        <LocaleSelector
          density={density}
          label="Idioma"
          onValueChange={() => undefined}
          options={options}
          value="pt"
        />,
    );

    const trigger = screen.getByText('Português', {selector: 'summary span'}).parentElement;

    expect(trigger?.parentElement).toHaveClass(widthClass);
    expect(trigger).toHaveClass(heightClass);
    expect(screen.getByRole('list', {name: 'Idioma'})).not.toHaveClass('fixed');
  });
});
