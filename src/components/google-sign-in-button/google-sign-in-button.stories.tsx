import type {Meta, StoryObj} from '@storybook/react-vite';
import {GoogleSignInButton} from './google-sign-in-button';

const meta = {
  title: 'Controls/GoogleSignInButton',
  component: GoogleSignInButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Entrar com Google',
  },
  argTypes: {
    label: {control: 'text'},
  },
} satisfies Meta<typeof GoogleSignInButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
