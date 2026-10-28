import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import * as components from '../../index';
import {AccountControl} from '../../index';

const defaultProps = {
  fallbackIdentity: 'Workspace account',
  menuAriaLabel: 'Account menu for Ada Lovelace',
  menuText: 'Account',
  onSignOut: vi.fn(),
  signOutAriaLabel: 'Sign out of this account',
  signOutText: 'Sign out',
};

describe('AccountControl', () => {
  it('exports the shared account menu', () => {
    expect(components).toHaveProperty('AccountControl');
  });

  it('shows the name, distinct email, and initials in the account option', async () => {
    const user = userEvent.setup();

    render(
        <AccountControl
          {...defaultProps}
          email="ada@example.com"
          name="Ada Lovelace"
        />,
    );

    expect(screen.getByRole('button', {
      name: 'AL Account menu for Ada Lovelace',
    })).toHaveTextContent('AL');

    await user.click(screen.getByRole('button', {
      name: 'AL Account menu for Ada Lovelace',
    }));

    expect(screen.getByText('Ada Lovelace')).toHaveAttribute(
        'title',
        'Ada Lovelace',
    );
    expect(screen.getByText('ada@example.com')).toHaveAttribute(
        'title',
        'ada@example.com',
    );
  });

  it('uses a circular initials trigger and shows the full email in the menu', async () => {
    const user = userEvent.setup();
    const email = 'ada.lovelace.with.a.very.long.email@example.com';

    render(
        <AccountControl
          {...defaultProps}
          email={email}
          name="Ada Lovelace"
        />,
    );

    const trigger = screen.getByRole('button', {
      name: 'AL Account menu for Ada Lovelace',
    });

    expect(trigger).toHaveClass('size-10', 'rounded-full');
    expect(trigger).toHaveTextContent('AL');
    expect(trigger).not.toHaveTextContent('Account');

    await user.click(trigger);

    expect(screen.getByText(email)).toHaveClass('break-all');
    expect(screen.getByText(email)).not.toHaveClass('truncate');
  });

  it('uses the fallback identity when the authentication profile is incomplete', async () => {
    const user = userEvent.setup();

    render(<AccountControl {...defaultProps} />);

    await user.click(screen.getByRole('button', {
      name: 'WA Account menu for Ada Lovelace',
    }));

    expect(screen.getByText('Workspace account')).toBeInTheDocument();
    expect(screen.queryByText('ada@example.com')).not.toBeInTheDocument();
  });

  it('uses the email when the authentication name contains only whitespace', () => {
    render(
        <AccountControl
          {...defaultProps}
          email="ada@example.com"
          name="   "
        />,
    );

    expect(screen.getByRole('button', {
      name: 'A Account menu for Ada Lovelace',
    })).toBeInTheDocument();
  });

  it('calls the consumer sign-out action once after selecting sign out', async () => {
    const onSignOut = vi.fn();
    const user = userEvent.setup();

    render(<AccountControl {...defaultProps} onSignOut={onSignOut} />);

    await user.click(screen.getByRole('button', {
      name: 'WA Account menu for Ada Lovelace',
    }));
    await user.click(screen.getByRole('button', {
      name: 'Sign out of this account',
    }));

    await waitFor(() => expect(onSignOut).toHaveBeenCalledTimes(1));
  });
});
