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
  it('requests a navigation locale change without redirecting', () => {
    const onValueChange = vi.fn();

    render(
        <LocaleSelector
          label="Idioma"
          onValueChange={onValueChange}
          options={options}
          triggerAriaLabel="Idioma: Português"
          value="pt"
          variant="navigation"
        />,
    );

    const trigger = screen.getByLabelText('Idioma: Português');
    const disclosure = trigger.parentElement;

    expect(trigger.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    expect(trigger).toHaveClass('select-none');
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

  it('renders the navigation selection supplied by a controlled consumer', () => {
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
            variant="navigation"
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
          variant="navigation"
        />,
    );

    const trigger = screen.getByText('Português', {selector: 'summary span'}).parentElement;

    expect(trigger?.parentElement).toHaveClass(widthClass);
    expect(trigger).toHaveClass(heightClass);
  });

  it('lets a dialog control the document language with pressed buttons', () => {
    function DocumentLanguageExample() {
      const [value, setValue] = useState('pt');

      return (
        <>
          <output>{value}</output>
          <LocaleSelector
            label="Idioma do currículo"
            onValueChange={setValue}
            options={options}
            triggerAriaLabel={`Idioma do currículo: ${value === 'pt' ? 'Português' : 'English'}`}
            value={value}
            variant="document"
          />
        </>
      );
    }

    render(<DocumentLanguageExample />);

    const trigger = screen.getByLabelText('Idioma do currículo: Português');
    const disclosure = trigger.parentElement;

    expect(trigger.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    expect(trigger).toHaveClass('select-none');
    expect(disclosure).toHaveClass('document-locale-disclosure');
    expect(screen.getByRole('list', {name: 'Idioma do currículo'})).toHaveClass('fixed', 'z-60');
    expect(screen.getByRole('button', {name: 'Português'})).toHaveClass('select-none');
    expect(screen.getByRole('button', {name: 'Português'})).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    expect(screen.getByRole('status')).toHaveTextContent('en');
    expect(screen.getByLabelText('Idioma do currículo: English')).toBeVisible();
    expect(screen.getByRole('button', {name: 'English'})).toHaveAttribute('aria-pressed', 'true');
    expect(disclosure).not.toHaveAttribute('open');
  });

  it('requests a document locale change without mutating the controlled value', () => {
    const onValueChange = vi.fn();

    render(
        <LocaleSelector
          label="Idioma do currículo"
          onValueChange={onValueChange}
          options={options}
          triggerAriaLabel="Idioma do currículo: Português"
          value="pt"
          variant="document"
        />,
    );

    const trigger = screen.getByLabelText('Idioma do currículo: Português');
    const disclosure = trigger.parentElement;
    const portugueseButton = screen.getByRole('button', {name: 'Português'});
    const englishButton = screen.getByRole('button', {name: 'English'});

    fireEvent.click(trigger);
    fireEvent.click(englishButton);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('en');
    expect(portugueseButton).toHaveAttribute('aria-pressed', 'true');
    expect(englishButton).toHaveAttribute('aria-pressed', 'false');
    expect(disclosure).not.toHaveAttribute('open');
  });
});
