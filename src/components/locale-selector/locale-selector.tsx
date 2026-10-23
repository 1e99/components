import {useCallback, useEffect, useRef, type ReactNode} from 'react';
import {LuChevronDown} from 'react-icons/lu';

export type LocaleSelectorOption = {
  label: ReactNode;
  languageTag?: string;
  value: string;
};

export type LocaleSelectorNavigationOption = LocaleSelectorOption;

export type LocaleSelectorDensity = 'compact' | 'compact-mobile' | 'standard';

type LocaleSelectorBaseProps = {
  label: string;
  triggerAriaLabel?: string;
  value: string;
};

export type LocaleSelectorNavigationProps = LocaleSelectorBaseProps & {
  density?: LocaleSelectorDensity;
  onValueChange: (value: string) => void;
  options: readonly LocaleSelectorNavigationOption[];
  variant: 'navigation';
  whiteSurface?: boolean;
};

export type LocaleSelectorDocumentProps = LocaleSelectorBaseProps & {
  onValueChange: (value: string) => void;
  options: readonly LocaleSelectorOption[];
  variant: 'document';
};

export type LocaleSelectorProps =
  | LocaleSelectorNavigationProps
  | LocaleSelectorDocumentProps;

const standardTriggerClassName =
  'flex w-full cursor-pointer list-none select-none items-center justify-between rounded-control border border-border-subtle py-control-y text-label font-semibold text-content-primary shadow-card transition-colors duration-200 ease-brand hover:bg-brand-cloud focus-visible:outline-none focus-visible:shadow-focus [&::-webkit-details-marker]:hidden';

const optionClassName =
  'flex min-h-12 w-full select-none items-center rounded-control px-3 text-label font-semibold text-content-secondary transition-colors duration-200 ease-brand hover:bg-brand-cloud hover:text-content-primary focus-visible:outline-none focus-visible:shadow-focus';

function closeLocaleDisclosure(element: HTMLElement) {
  element.closest('details')?.removeAttribute('open');
}

function getNavigationLayout(density: LocaleSelectorDensity) {
  if (density === 'compact') {
    return {trigger: 'h-12 gap-2', wrapper: 'w-auto'};
  }

  if (density === 'compact-mobile') {
    return {trigger: 'h-12 gap-2 px-3 md:gap-4 md:px-4 md:min-w-32', wrapper: 'w-auto'};
  }

  return {trigger: 'min-h-12 gap-4 px-4 md:min-w-32', wrapper: 'w-full md:w-auto'};
}

function LocaleTrigger({densityClassName, option, triggerAriaLabel, value}: {
  densityClassName: string;
  option?: LocaleSelectorOption;
  triggerAriaLabel: string;
  value: string;
}) {
  return (
    <summary aria-label={triggerAriaLabel} className={`${standardTriggerClassName} ${densityClassName}`}>
      <span lang={option?.languageTag}>{option?.label ?? value}</span>
      <LuChevronDown
        aria-hidden="true"
        className="locale-disclosure-arrow size-5 shrink-0 text-content-secondary transition-transform duration-200 ease-brand motion-reduce:transition-none group-open:rotate-180"
      />
    </summary>
  );
}

function NavigationLocaleSelector({
  density = 'standard',
  label,
  onValueChange,
  options,
  triggerAriaLabel = label,
  value,
  whiteSurface = false,
}: LocaleSelectorNavigationProps) {
  const selectedOption = options.find((option) => option.value === value);
  const layout = getNavigationLayout(density);
  const surfaceClassName = whiteSurface ? 'bg-white' : 'bg-surface-raised';

  return (
    <details className={`locale-disclosure group relative ${layout.wrapper}`}>
      <LocaleTrigger
        densityClassName={layout.trigger}
        option={selectedOption}
        triggerAriaLabel={triggerAriaLabel}
        value={value}
      />
      <ul
        aria-label={label}
        className={`mt-2 w-full overflow-hidden rounded-control border border-border-subtle ${surfaceClassName} p-1 shadow-float md:absolute md:top-full md:right-0 md:z-60 md:min-w-44`}
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <li key={option.value}>
              <button
                aria-pressed={isSelected}
                className={`${optionClassName} text-left ${isSelected ? 'bg-brand-cloud text-content-primary' : ''}`}
                lang={option.languageTag}
                onClick={(event) => {
                  onValueChange(option.value);
                  closeLocaleDisclosure(event.currentTarget);
                }}
                type="button"
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function DocumentLocaleSelector({
  label,
  onValueChange,
  options,
  triggerAriaLabel = label,
  value,
}: LocaleSelectorDocumentProps) {
  const detailsReference = useRef<HTMLDetailsElement>(null);
  const triggerReference = useRef<HTMLElement>(null);
  const menuReference = useRef<HTMLUListElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  const positionMenu = useCallback(() => {
    const trigger = triggerReference.current;
    const menu = menuReference.current;

    if (!trigger || !menu) return;

    const bounds = trigger.getBoundingClientRect();
    menu.style.top = `${bounds.bottom + 8}px`;
    menu.style.left = `${bounds.left}px`;
    menu.style.width = `${bounds.width}px`;
  }, []);

  useEffect(() => {
    const details = detailsReference.current;
    if (!details) return;

    const handleToggle = () => {
      if (!details.open) {
        window.removeEventListener('resize', positionMenu);
        return;
      }

      positionMenu();
      window.addEventListener('resize', positionMenu);
    };

    details.addEventListener('toggle', handleToggle);
    return () => {
      details.removeEventListener('toggle', handleToggle);
      window.removeEventListener('resize', positionMenu);
    };
  }, [positionMenu]);

  return (
    <details ref={detailsReference} className="document-locale-disclosure group relative mt-2 w-full">
      <summary
        ref={triggerReference}
        aria-label={triggerAriaLabel}
        className={`${standardTriggerClassName} min-h-12 gap-4 px-4`}
      >
        <span lang={selectedOption?.languageTag}>
          {selectedOption?.label ?? value}
        </span>
        <LuChevronDown
          aria-hidden="true"
          className="document-locale-disclosure-arrow size-5 shrink-0 text-content-secondary transition-transform duration-200 ease-brand motion-reduce:transition-none group-open:rotate-180"
        />
      </summary>
      <ul
        ref={menuReference}
        aria-label={label}
        className="fixed z-60 overflow-hidden rounded-control border border-border-subtle bg-surface-raised p-1 shadow-float"
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <li key={option.value}>
              <button
                aria-pressed={isSelected}
                className={`${optionClassName} text-left ${isSelected ? 'bg-brand-cloud text-content-primary' : ''}`}
                lang={option.languageTag}
                onClick={(event) => {
                  onValueChange(option.value);
                  closeLocaleDisclosure(event.currentTarget);
                }}
                type="button"
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export function LocaleSelector(props: LocaleSelectorProps) {
  return props.variant === 'navigation' ? (
    <NavigationLocaleSelector {...props} />
  ) : (
    <DocumentLocaleSelector {...props} />
  );
}
