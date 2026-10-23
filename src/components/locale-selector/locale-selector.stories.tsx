import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {LocaleSelector} from './locale-selector';

const options = [
  {label: 'Português', languageTag: 'pt-BR', value: 'pt'},
  {label: 'English', languageTag: 'en', value: 'en'},
  {label: 'Español', languageTag: 'es', value: 'es'},
] as const;

function LocaleSelectorPreview() {
  const [value, setValue] = useState('pt');
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <div className="w-80">
      <LocaleSelector
        label="Idioma"
        onValueChange={setValue}
        options={options}
        triggerAriaLabel={`Idioma: ${selectedLabel}`}
        value={value}
      />
    </div>
  );
}

const meta = {
  title: 'Controls/LocaleSelector',
  component: LocaleSelector,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NavbarLanguage: Story = {
  args: {
    label: 'Idioma',
    onValueChange: () => undefined,
    options,
    value: 'pt',
  },
  render: () => <LocaleSelectorPreview />,
};
