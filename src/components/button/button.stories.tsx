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
    'aria-label': 'Fechar',
    'children': <LuX aria-hidden="true" />,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
