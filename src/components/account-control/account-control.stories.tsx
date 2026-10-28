import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {
  AccountControl,
  type AccountControlProps,
} from './account-control';

export type AccountControlStoryArgs = Omit<AccountControlProps, 'onSignOut'>;

function AccountControlPreview(props: AccountControlStoryArgs) {
  const [signOutRequested, setSignOutRequested] = useState(false);

  return (
    <div className="w-72 rounded-card bg-surface-page p-4">
      <div className="flex justify-end">
        <AccountControl
          {...props}
          onSignOut={() => setSignOutRequested(true)}
        />
      </div>
      {signOutRequested ? (
        <p className="mt-3 text-label text-content-secondary" role="status">
          Sign-out requested
        </p>
      ) : null}
    </div>
  );
}

function AccountControlWithAdditionalActionPreview(
    props: AccountControlStoryArgs,
) {
  const [clearRequested, setClearRequested] = useState(false);
  const [signOutRequested, setSignOutRequested] = useState(false);

  return (
    <div className="w-72 rounded-card bg-surface-page p-4">
      <div className="flex justify-end">
        <AccountControl {...props} onSignOut={() => setSignOutRequested(true)}>
          <div className="border-b border-border-subtle px-3 py-3">
            <p className="text-label leading-5 text-content-secondary">
              Local drafts are stored on this device.
            </p>
          </div>
          <div className="p-1 pt-2">
            <button
              className="flex min-h-12 w-full items-center rounded-control px-3 text-left text-label font-semibold text-feedback-danger hover:bg-feedback-danger-soft focus-visible:outline-none focus-visible:shadow-focus"
              onClick={() => setClearRequested(true)}
              type="button"
            >
              Clear local data
            </button>
          </div>
        </AccountControl>
      </div>
      {clearRequested ? (
        <p className="mt-3 text-label text-content-secondary" role="status">
          Local data clear requested
        </p>
      ) : null}
      {signOutRequested ? (
        <p className="mt-3 text-label text-content-secondary" role="status">
          Sign-out requested
        </p>
      ) : null}
    </div>
  );
}

const meta = {
  title: 'Controls/AccountControl',
  component: AccountControlPreview,
  parameters: {
    layout: 'centered',
  },
  args: {
    email: 'ada@example.com',
    fallbackIdentity: 'Workspace account',
    menuAriaLabel: 'Account menu for Ada Lovelace',
    menuText: 'Account',
    name: 'Ada Lovelace',
    signOutAriaLabel: 'Sign out of this account',
    signOutText: 'Sign out',
  },
  argTypes: {
    email: {control: 'text'},
    fallbackIdentity: {control: 'text'},
    menuAriaLabel: {control: 'text'},
    menuText: {control: 'text'},
    name: {control: 'text'},
    signOutAriaLabel: {control: 'text'},
    signOutText: {control: 'text'},
  },
} satisfies Meta<AccountControlStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmailOnly: Story = {
  args: {
    email: 'owner@example.com',
    menuAriaLabel: 'Account menu for owner@example.com',
    name: null,
  },
};

export const LongIdentity: Story = {
  args: {
    email: 'ada.lovelace.with.a.very.long.email@example.com',
    menuAriaLabel: 'Account menu for Ada Lovelace the First of Her Name',
    name: 'Ada Lovelace the First of Her Name',
  },
};

export const WithAdditionalAction: Story = {
  render: (args) => <AccountControlWithAdditionalActionPreview {...args} />,
};
