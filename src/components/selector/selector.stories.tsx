import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {LuListTodo, LuUsers} from 'react-icons/lu';
import {Selector} from './selector';

const languageOptions = [
  {label: 'Português', languageTag: 'pt-BR', value: 'pt'},
  {label: 'English', languageTag: 'en', value: 'en'},
  {label: 'Español', languageTag: 'es', value: 'es'},
] as const;

const workspaceOptions = [
  {
    description: 'Trabalhe com sua equipe.',
    icon: LuUsers,
    label: 'Colaboração',
    value: 'teamwork',
  },
  {
    description: 'Organize suas tarefas.',
    icon: LuListTodo,
    label: 'Produtividade',
    value: 'focus',
  },
] as const;

function LanguageSelectorPreview() {
  const [value, setValue] = useState('pt');
  const selectedOption = languageOptions.find(
      (option) => option.value === value,
  );

  return (
    <div className="w-80">
      <Selector
        label="Idioma"
        onValueChange={setValue}
        options={languageOptions}
        renderOption={({option}) => (
          <span lang={option.languageTag}>{option.label}</span>
        )}
        renderTrigger={({
          selectedOption: selectedLanguage,
          value: selectedValue,
        }) => (
          <span lang={selectedLanguage?.languageTag}>
            {selectedLanguage?.label ?? selectedValue}
          </span>
        )}
        triggerAriaLabel={`Idioma: ${selectedOption?.label ?? value}`}
        value={value}
      />
    </div>
  );
}

function WorkspaceSelectorPreview() {
  const [value, setValue] = useState('teamwork');

  return (
    <div className="w-80">
      <Selector
        label="Área de trabalho"
        onValueChange={setValue}
        options={workspaceOptions}
        renderOption={({option}) => {
          const Icon = option.icon;

          return (
            <span className="flex items-center gap-3">
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-caption font-normal">{option.description}</span>
              </span>
            </span>
          );
        }}
        renderTrigger={({selectedOption, value: selectedValue}) => {
          if (!selectedOption) {
            return selectedValue;
          }

          const Icon = selectedOption.icon;

          return (
            <span className="flex items-center gap-2">
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span>{selectedOption.label}</span>
            </span>
          );
        }}
        value={value}
      />
    </div>
  );
}

const meta = {
  title: 'Controls/Selector',
  component: Selector,
  args: {
    label: 'Idioma',
    onValueChange: () => undefined,
    options: languageOptions,
    value: 'pt',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Selector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Language: Story = {
  render: () => <LanguageSelectorPreview />,
};

export const CustomContent: Story = {
  render: () => <WorkspaceSelectorPreview />,
};
