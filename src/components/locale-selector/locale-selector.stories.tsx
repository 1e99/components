import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {LocaleSelector} from './locale-selector';

const options = [
  {label: 'Português', languageTag: 'pt-BR', value: 'pt'},
  {label: 'English', languageTag: 'en', value: 'en'},
  {label: 'Español', languageTag: 'es', value: 'es'},
] as const;

function NavigationLanguagePreview() {
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
        variant="navigation"
      />
    </div>
  );
}

function DocumentLanguagePreview() {
  const [value, setValue] = useState('pt');
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <div className="w-80 rounded-card border border-border-subtle bg-surface-page p-6 shadow-card">
      <p className="text-label font-bold text-content-primary">Gerar e baixar seu PDF?</p>
      <p className="mt-2 text-ui text-content-secondary">
        Os títulos do PDF serão gerados neste idioma.
      </p>
      <LocaleSelector
        label="Idioma do currículo"
        onValueChange={setValue}
        options={options}
        triggerAriaLabel={`Idioma do currículo: ${selectedLabel}`}
        value={value}
        variant="document"
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
    variant: 'navigation',
  },
  render: () => <NavigationLanguagePreview />,
};

export const DocumentLanguage: Story = {
  args: {
    label: 'Idioma do currículo',
    onValueChange: () => undefined,
    options,
    value: 'pt',
    variant: 'document',
  },
  render: () => <DocumentLanguagePreview />,
};
