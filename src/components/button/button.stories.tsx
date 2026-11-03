import type {Meta, StoryObj} from '@storybook/react-vite';
import {LuX} from 'react-icons/lu';
import {Button} from './button';

const meta = {
  title: 'Controls/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Abrir planos',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Icon: Story = {
  args: {
    'aria-label': 'Fechar',
    'children': <LuX aria-hidden="true" />,
    'size': 'icon',
  },
};
