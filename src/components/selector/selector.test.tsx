import {fireEvent, render, screen, waitFor} from '@testing-library/react';
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
  it('requests a value change without navigating or changing its controlled value', async () => {
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
    const selector = trigger.parentElement;

    expect(trigger.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    expect(trigger).toHaveClass('select-none');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(selector).toHaveClass('selector-disclosure');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const portugueseButton = screen.getByRole('button', {name: 'Português'});
    const englishButton = screen.getByRole('button', {name: 'English'});

    expect(portugueseButton).toHaveAttribute('aria-pressed', 'true');
    expect(englishButton).toHaveAttribute('aria-pressed', 'false');
    expect(englishButton).toHaveClass('select-none');
    expect(englishButton).not.toHaveAttribute('aria-current');
    expect(englishButton).not.toHaveAttribute('href');

    fireEvent.click(englishButton);

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith('en');
    });

    expect(portugueseButton).toHaveAttribute('aria-pressed', 'true');
    expect(englishButton).toHaveAttribute('aria-pressed', 'false');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('list', {name: 'Idioma'})).not.toBeInTheDocument();
  });

  it('closes an open selector when a pointer starts outside it', () => {
    render(
        <Selector
          label="Idioma"
          onValueChange={() => undefined}
          options={languageOptions}
          triggerAriaLabel="Idioma: Português"
          value="pt"
        />,
    );

    const trigger = screen.getByLabelText('Idioma: Português');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerDown(document.body);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('list', {name: 'Idioma'})).not.toBeInTheDocument();
  });

  it('closes an open selector when an outside target stops pointer propagation', () => {
    render(
        <>
          <button onPointerDown={(event) => event.stopPropagation()} type="button">
            Outside
          </button>
          <Selector
            label="Idioma"
            onValueChange={() => undefined}
            options={languageOptions}
            triggerAriaLabel="Idioma: Português"
            value="pt"
          />
        </>,
    );

    const trigger = screen.getByLabelText('Idioma: Português');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerDown(screen.getByRole('button', {name: 'Outside'}));

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('list', {name: 'Idioma'})).not.toBeInTheDocument();
  });

  it('closes the selector before notifying a consumer of a new value', () => {
    let trigger: HTMLElement | null = null;
    let wasOpenWhenValueChanged: boolean | undefined;

    render(
        <Selector
          label="Idioma"
          onValueChange={() => {
            wasOpenWhenValueChanged = trigger?.getAttribute('aria-expanded') === 'true';
          }}
          options={languageOptions}
          triggerAriaLabel="Idioma: Português"
          value="pt"
        />,
    );

    trigger = screen.getByLabelText('Idioma: Português');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    expect(wasOpenWhenValueChanged).toBe(false);
  });

  it('removes its option list before notifying a consumer', async () => {
    let optionListWasRenderedWhenValueChanged: boolean | undefined;
    const onValueChange = vi.fn(() => {
      optionListWasRenderedWhenValueChanged =
        document.querySelector('ul[aria-label="Idioma"]') !== null;
    });

    render(
        <Selector
          label="Idioma"
          onValueChange={onValueChange}
          options={languageOptions}
          triggerAriaLabel="Idioma: Português"
          value="pt"
        />,
    );

    fireEvent.click(screen.getByLabelText('Idioma: Português'));
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('en');
    });

    expect(optionListWasRenderedWhenValueChanged).toBe(false);
  });

  it('closes the selector before a custom option notifies a consumer', () => {
    let trigger: HTMLElement | null = null;
    let wasOpenWhenValueChanged: boolean | undefined;

    render(
        <Selector
          label="Idioma"
          onValueChange={() => {
            wasOpenWhenValueChanged = trigger?.getAttribute('aria-expanded') === 'true';
          }}
          options={languageOptions}
          renderOption={({option, select}) => (
            <span
              onClick={(event) => {
                event.stopPropagation();
                select();
              }}
            >
              {option.label}
            </span>
          )}
          triggerAriaLabel="Idioma: Português"
          value="pt"
        />,
    );

    trigger = screen.getByLabelText('Idioma: Português');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('English', {selector: 'span'}));

    expect(wasOpenWhenValueChanged).toBe(false);
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
    fireEvent.click(screen.getByLabelText('Idioma: English'));
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

    expect(screen.getByText('unknown', {selector: 'button span'})).toBeVisible();
  });

  it('announces its visible controlled value when no custom trigger label is supplied', () => {
    function LanguageExample() {
      const [value, setValue] = useState('pt');

      return (
        <Selector
          label="Idioma"
          onValueChange={setValue}
          options={languageOptions}
          value={value}
        />
      );
    }

    render(<LanguageExample />);

    const portugueseTrigger = screen
        .getByText('Português', {selector: 'button span'})
        .closest('button');

    expect(portugueseTrigger).toHaveAccessibleName('Português');

    fireEvent.click(portugueseTrigger as HTMLElement);
    fireEvent.click(screen.getByRole('button', {name: 'English'}));

    const englishTrigger = screen
        .getByText('English', {selector: 'button span'})
        .closest('button');

    expect(englishTrigger).toHaveAccessibleName('English');
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

    const trigger = screen.getByText('Português', {selector: 'button span'}).parentElement;

    expect(trigger?.parentElement).toHaveClass(widthClass);
    expect(trigger).toHaveClass(heightClass);
    fireEvent.click(trigger as HTMLElement);
    expect(screen.getByRole('list', {name: 'Idioma'})).not.toHaveClass('fixed');
  });
});
