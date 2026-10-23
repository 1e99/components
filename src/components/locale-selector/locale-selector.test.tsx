import {fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import {describe, expect, it} from 'vitest';
import {LocaleSelector} from './locale-selector';

const options = [
  {href: '/pt', label: 'Português', languageTag: 'pt-BR', value: 'pt'},
  {href: '/en', label: 'English', languageTag: 'en', value: 'en'},
  {href: '/es', label: 'Español', languageTag: 'es', value: 'es'},
] as const;

describe('LocaleSelector', () => {
  it('renders localized navigation links and closes after choosing one', () => {
    render(
        <LocaleSelector
          label="Idioma"
          options={options}
          triggerAriaLabel="Idioma: Português"
          value="pt"
          variant="navigation"
        />,
    );

    const trigger = screen.getByLabelText('Idioma: Português');
    const disclosure = trigger.parentElement;

    expect(screen.getByRole('link', {name: 'Português'})).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', {name: 'Português'})).toHaveAttribute('href', '/pt');
    expect(screen.getByRole('link', {name: 'Português'})).toHaveAttribute('lang', 'pt-BR');

    fireEvent.click(trigger);
    expect(disclosure).toHaveAttribute('open');

    const englishLink = screen.getByRole('link', {name: 'English'});
    englishLink.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(englishLink);
    expect(disclosure).not.toHaveAttribute('open');
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

    expect(disclosure).toHaveClass('document-locale-disclosure');
    expect(screen.getByRole('list', {name: 'Idioma do currículo'})).toHaveClass('fixed', 'z-60');
    expect(screen.getByRole('button', {name: 'Português'})).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    expect(screen.getByRole('status')).toHaveTextContent('en');
    expect(screen.getByLabelText('Idioma do currículo: English')).toBeVisible();
    expect(screen.getByRole('button', {name: 'English'})).toHaveAttribute('aria-pressed', 'true');
    expect(disclosure).not.toHaveAttribute('open');
  });
});
