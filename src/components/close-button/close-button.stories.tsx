import type {Meta, StoryObj} from '@storybook/react-vite';
import {CloseButton} from './close-button';

const meta = {
  title: 'Controls/CloseButton',
  component: CloseButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Fechar',
  },
  argTypes: {
    label: {control: 'text'},
  },
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
