import {fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {Selector, type SelectorRenderOptionContext} from './selector';

const languageOptions = [
  {label: 'Português', value: 'pt'},
  {label: 'English', value: 'en'},
  {label: 'Español', value: 'es'},
] as const;

const catalogOptions = [
  {description: 'Trabalhe com sua equipe.', label: 'Colaboração', value: 'teamwork'},
  {description: 'Organize suas tarefas.', label: 'Produtividade', value: 'focus'},
] as const;

describe('Selector', () => {
  it('requests a value change without navigating or changing its controlled value', () => {
    const onValueChange = vi.fn();

    render(
        <Selector
          label="Idioma"
          onValueChange={onValueChange}
          options={languageOptions}
          triggerAriaLabel="Idioma: Português"
          value="pt"
        />,
    );

    const trigger = screen.getByLabelText('Idioma: Português');
    const disclosure = trigger.parentElement;
    const portugueseButton = screen.getByRole('button', {name: 'Português'});
    const englishButton = screen.getByRole('button', {name: 'English'});

    expect(trigger.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    expect(trigger).toHaveClass('select-none');
    expect(disclosure).toHaveClass('selector-disclosure');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
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
    function LanguageExample() {
      const [value, setValue] = useState('pt');

      return (
        <>
          <output>{value}</output>
          <Selector
            label="Idioma"
            onValueChange={setValue}
            options={languageOptions}
            triggerAriaLabel={`Idioma: ${value === 'pt' ? 'Português' : 'English'}`}
            value={value}
          />
        </>
      );
    }

    render(<LanguageExample />);

    fireEvent.click(screen.getByLabelText('Idioma: Português'));
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    expect(screen.getByRole('status')).toHaveTextContent('en');
    expect(screen.getByLabelText('Idioma: English')).toBeVisible();
    expect(screen.getByRole('button', {name: 'English'})).toHaveAttribute(
        'aria-pressed',
        'true',
    );
  });

  it('renders extended options through custom trigger and option content', () => {
    const renderedOptions: SelectorRenderOptionContext<
      (typeof catalogOptions)[number]
    >[] = [];

    render(
        <Selector
          label="Área de trabalho"
          onValueChange={() => undefined}
          options={catalogOptions}
          renderOption={(context) => {
            renderedOptions.push(context);

            return <span>{context.option.description}</span>;
          }}
          renderTrigger={({selectedOption}) => (
            <span>{selectedOption?.description ?? 'Nenhuma seleção'}</span>
          )}
          triggerAriaLabel="Selecionar área de trabalho"
          value="teamwork"
        />,
    );

    fireEvent.click(screen.getByLabelText('Selecionar área de trabalho'));

    expect(screen.getByRole('button', {name: 'Trabalhe com sua equipe.'})).toBeVisible();
    expect(screen.getByRole('button', {name: 'Organize suas tarefas.'})).toBeVisible();
    expect(renderedOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        isSelected: true,
        option: catalogOptions[0],
        select: expect.any(Function),
      }),
      expect.objectContaining({
        isSelected: false,
        option: catalogOptions[1],
        select: expect.any(Function),
      }),
    ]));
  });

  it('shows an unknown controlled value when no option is selected', () => {
    render(
        <Selector
          label="Área de trabalho"
          onValueChange={() => undefined}
          options={catalogOptions}
          value="unknown"
        />,
    );

    expect(screen.getByText('unknown', {selector: 'summary span'})).toBeVisible();
  });

  it.each([
    ['standard', 'w-full', 'min-h-12'],
    ['compact', 'w-auto', 'h-12'],
    ['compact-mobile', 'w-auto', 'h-12'],
  ] as const)('keeps the %s density used by navigation', (density, widthClass, heightClass) => {
    render(
        <Selector
          density={density}
          label="Idioma"
          onValueChange={() => undefined}
          options={languageOptions}
          value="pt"
        />,
    );

    const trigger = screen.getByText('Português', {selector: 'summary span'}).parentElement;

    expect(trigger?.parentElement).toHaveClass(widthClass);
    expect(trigger).toHaveClass(heightClass);
    expect(screen.getByRole('list', {name: 'Idioma'})).not.toHaveClass('fixed');
  });
});
