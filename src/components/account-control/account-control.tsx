import {LuLogOut} from 'react-icons/lu';
import {getInitials} from '../../utils/get-initials';
import {Selector} from '../selector/selector';

export type AccountControlProps = {
  email?: string | null;
  fallbackIdentity: string;
  menuAriaLabel: string;
  menuText: string;
  name?: string | null;
  onSignOut: () => void;
  signOutAriaLabel: string;
  signOutText: string;
};

export function AccountControl({
  email,
  fallbackIdentity,
  menuAriaLabel,
  menuText,
  name,
  onSignOut,
  signOutAriaLabel,
  signOutText,
}: AccountControlProps) {
  const normalizedName = name?.trim();
  const identity = normalizedName || email || fallbackIdentity;
  const initials = getInitials(identity);
  const showEmail = Boolean(email && email !== identity);
  const options = [
    {label: identity, value: 'account'},
    {label: signOutText, value: 'sign-out'},
  ];

  return (
    <Selector
      label={menuText}
      onValueChange={(value) => {
        if (value === 'sign-out') {
          onSignOut();
        }
      }}
      options={options}
      renderOption={({option}) => option.value === 'account' ? (
        <span data-account-identity className="flex min-w-0 flex-col items-start py-1">
          <span
            className="w-full truncate text-ui font-semibold text-content-primary"
            title={identity}
          >
            {identity}
          </span>
          {showEmail ? (
            <span
              className="mt-1 w-full truncate text-label text-content-secondary"
              title={email ?? undefined}
            >
              {email}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="flex items-center gap-3">
          <LuLogOut aria-hidden="true" className="size-5 shrink-0" />
          <span aria-hidden="true">{option.label}</span>
          <span className="sr-only">{signOutAriaLabel}</span>
        </span>
      )}
      renderTrigger={() => (
        <span aria-hidden="true" className="flex items-center gap-3 md:gap-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-yellow font-data">
            {initials}
          </span>
          <span className="text-label font-semibold md:hidden">{menuText}</span>
        </span>
      )}
      showTriggerIndicator={false}
      triggerAriaLabel={`${initials} ${menuAriaLabel}`}
      triggerClassName="flex min-h-12 w-full cursor-pointer select-none items-center justify-start rounded-control border border-border-subtle bg-surface-raised px-3 text-label font-semibold text-brand-navy-dark shadow-card transition-colors duration-200 ease-brand hover:bg-brand-cloud focus-visible:outline-none focus-visible:shadow-focus md:size-10 md:min-h-0 md:w-10 md:justify-center md:rounded-full md:bg-white md:p-1"
      value="account"
    />
  );
}
