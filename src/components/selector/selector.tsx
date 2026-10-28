import {type ReactNode, useEffect, useId, useRef, useState} from 'react';
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
  showTriggerIndicator?: boolean;
  triggerAriaLabel?: string;
  triggerClassName?: string;
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
  'flex w-full cursor-pointer select-none items-center justify-between rounded-control border border-border-subtle py-control-y text-label font-semibold text-content-primary shadow-card transition-colors duration-200 ease-brand hover:bg-brand-cloud focus-visible:outline-none focus-visible:shadow-focus';

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
  isOpen,
  onClick,
  optionListId,
  renderTrigger,
  selectedOption,
  showTriggerIndicator,
  triggerAriaLabel,
  triggerClassName,
  value,
}: {
  densityClassName: string;
  isOpen: boolean;
  onClick: () => void;
  optionListId: string;
  renderTrigger?: (context: SelectorRenderTriggerContext<TOption>) => ReactNode;
  selectedOption: TOption | undefined;
  showTriggerIndicator: boolean;
  triggerAriaLabel?: string;
  triggerClassName?: string;
  value: string;
}) {
  const triggerContent = renderTrigger?.({selectedOption, value}) ??
    selectedOption?.label ?? value;

  return (
    <button
      aria-controls={optionListId}
      aria-expanded={isOpen}
      aria-label={triggerAriaLabel}
      className={triggerClassName ?? `${standardTriggerClassName} ${densityClassName}`}
      onClick={onClick}
      type="button"
    >
      <span>{triggerContent}</span>
      {showTriggerIndicator ? (
        <LuChevronDown
          aria-hidden="true"
          className={`selector-disclosure-arrow size-5 shrink-0 text-content-secondary transition-transform duration-200 ease-brand motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
        />
      ) : null}
    </button>
  );
}

export function Selector<TOption extends SelectorOption = SelectorOption>({
  density = 'standard',
  label,
  onValueChange,
  options,
  renderOption,
  renderTrigger,
  showTriggerIndicator = true,
  triggerAriaLabel,
  triggerClassName,
  value,
  whiteSurface = false,
}: SelectorProps<TOption>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectionRequest, setSelectionRequest] =
    useState<{value: string} | null>(null);
  const optionListId = useId();
  const notifiedSelectionReference = useRef<{value: string} | null>(null);
  const onValueChangeReference = useRef(onValueChange);
  const selectorReference = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const layout = getNavigationLayout(density);
  const surfaceClassName = whiteSurface ? 'bg-white' : 'bg-surface-raised';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeWhenPointerStartsOutside = (event: PointerEvent) => {
      const selectorElement = selectorReference.current;

      if (
        !selectorElement ||
        !(event.target instanceof Node) ||
        selectorElement.contains(event.target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeWhenPointerStartsOutside, true);

    return () => {
      document.removeEventListener('pointerdown', closeWhenPointerStartsOutside, true);
    };
  }, [isOpen]);

  useEffect(() => {
    onValueChangeReference.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    if (
      isOpen ||
      selectionRequest === null ||
      selectionRequest === notifiedSelectionReference.current
    ) {
      return;
    }

    notifiedSelectionReference.current = selectionRequest;
    onValueChangeReference.current(selectionRequest.value);
  }, [isOpen, selectionRequest]);

  const selectOption = (nextValue: string) => {
    setIsOpen(false);
    setSelectionRequest({value: nextValue});
  };

  return (
    <div ref={selectorReference} className={`selector-disclosure relative ${layout.wrapper}`}>
      <SelectorTrigger
        densityClassName={layout.trigger}
        isOpen={isOpen}
        onClick={() => setIsOpen((currentOpen) => !currentOpen)}
        optionListId={optionListId}
        renderTrigger={renderTrigger}
        selectedOption={selectedOption}
        showTriggerIndicator={showTriggerIndicator}
        triggerAriaLabel={triggerAriaLabel}
        triggerClassName={triggerClassName}
        value={value}
      />
      {isOpen ? (
        <ul
          aria-label={label}
          className={`mt-2 w-full overflow-hidden rounded-control border border-border-subtle ${surfaceClassName} p-1 shadow-float md:absolute md:top-full md:right-0 md:z-60 md:min-w-44`}
          id={optionListId}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const select = () => selectOption(option.value);
            const optionContent =
              renderOption?.({isSelected, option, select}) ?? option.label;

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
      ) : null}
    </div>
  );
}
