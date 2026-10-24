import {type ReactNode, useCallback, useEffect, useState} from 'react';
import {LuChevronDown} from 'react-icons/lu';

export type SelectorOption = {
  label: ReactNode;
  value: string;
};

export type SelectorDensity = 'compact' | 'compact-mobile' | 'standard';

export type SelectorRenderOptionContext<TOption extends SelectorOption> = {
  isSelected: boolean;
  option: TOption;
  select: () => void;
};

export type SelectorRenderTriggerContext<TOption extends SelectorOption> = {
  selectedOption: TOption | undefined;
  value: string;
};

type SelectorBaseProps = {
  label: string;
  triggerAriaLabel?: string;
  value: string;
};

export type SelectorProps<TOption extends SelectorOption = SelectorOption> =
  SelectorBaseProps & {
    density?: SelectorDensity;
    onValueChange: (value: string) => void;
    options: readonly TOption[];
    renderOption?: (context: SelectorRenderOptionContext<TOption>) => ReactNode;
    renderTrigger?: (
      context: SelectorRenderTriggerContext<TOption>,
    ) => ReactNode;
    whiteSurface?: boolean;
  };

const standardTriggerClassName =
  'flex w-full cursor-pointer list-none select-none items-center justify-between rounded-control border border-border-subtle py-control-y text-label font-semibold text-content-primary shadow-card transition-colors duration-200 ease-brand hover:bg-brand-cloud focus-visible:outline-none focus-visible:shadow-focus [&::-webkit-details-marker]:hidden';

const optionClassName =
  'flex min-h-12 w-full select-none items-center rounded-control px-3 text-label font-semibold text-content-secondary transition-colors duration-200 ease-brand hover:bg-brand-cloud hover:text-content-primary focus-visible:outline-none focus-visible:shadow-focus';

function getNavigationLayout(density: SelectorDensity) {
  if (density === 'compact') {
    return {trigger: 'h-12 gap-2', wrapper: 'w-auto'};
  }

  if (density === 'compact-mobile') {
    return {
      trigger: 'h-12 gap-2 px-3 md:gap-4 md:px-4 md:min-w-32',
      wrapper: 'w-auto',
    };
  }

  return {trigger: 'min-h-12 gap-4 px-4 md:min-w-32', wrapper: 'w-full md:w-auto'};
}

function SelectorTrigger<TOption extends SelectorOption>({
  densityClassName,
  renderTrigger,
  selectedOption,
  triggerAriaLabel,
  value,
}: {
  densityClassName: string;
  renderTrigger?: (context: SelectorRenderTriggerContext<TOption>) => ReactNode;
  selectedOption: TOption | undefined;
  triggerAriaLabel?: string;
  value: string;
}) {
  const triggerContent = renderTrigger?.({selectedOption, value}) ??
    selectedOption?.label ?? value;

  return (
    <summary aria-label={triggerAriaLabel} className={`${standardTriggerClassName} ${densityClassName}`}>
      <span>{triggerContent}</span>
      <LuChevronDown
        aria-hidden="true"
        className="selector-disclosure-arrow size-5 shrink-0 text-content-secondary transition-transform duration-200 ease-brand motion-reduce:transition-none group-open:rotate-180"
      />
    </summary>
  );
}

export function Selector<TOption extends SelectorOption = SelectorOption>({
  density = 'standard',
  label,
  onValueChange,
  options,
  renderOption,
  renderTrigger,
  triggerAriaLabel,
  value,
  whiteSurface = false,
}: SelectorProps<TOption>) {
  const [selectorElement, setSelectorElement] =
    useState<HTMLDetailsElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);
  const layout = getNavigationLayout(density);
  const surfaceClassName = whiteSurface ? 'bg-white' : 'bg-surface-raised';

  useEffect(() => {
    if (!selectorElement) {
      return;
    }

    const closeWhenPointerStartsOutside = (event: PointerEvent) => {
      if (
        !selectorElement.open ||
        !(event.target instanceof Node) ||
        selectorElement.contains(event.target)
      ) {
        return;
      }

      selectorElement.removeAttribute('open');
    };

    document.addEventListener('pointerdown', closeWhenPointerStartsOutside, true);

    return () => {
      document.removeEventListener('pointerdown', closeWhenPointerStartsOutside, true);
    };
  }, [selectorElement]);

  const selectOption = useCallback((option: TOption) => {
    selectorElement?.removeAttribute('open');
    onValueChange(option.value);
  }, [onValueChange, selectorElement]);

  return (
    <details
      ref={setSelectorElement}
      className={`selector-disclosure group relative ${layout.wrapper}`}
    >
      <SelectorTrigger
        densityClassName={layout.trigger}
        renderTrigger={renderTrigger}
        selectedOption={selectedOption}
        triggerAriaLabel={triggerAriaLabel}
        value={value}
      />
      <ul
        aria-label={label}
        className={`mt-2 w-full overflow-hidden rounded-control border border-border-subtle ${surfaceClassName} p-1 shadow-float md:absolute md:top-full md:right-0 md:z-60 md:min-w-44`}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          const select = () => selectOption(option);
          const optionContent = renderOption?.({isSelected, option, select}) ??
            option.label;

          return (
            <li key={option.value}>
              <button
                aria-pressed={isSelected}
                className={`${optionClassName} text-left ${isSelected ? 'bg-brand-cloud text-content-primary' : ''}`}
                onClick={select}
                type="button"
              >
                {optionContent}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
