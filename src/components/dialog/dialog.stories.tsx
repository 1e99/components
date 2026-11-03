import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {Button} from '../button/button';
import {Dialog} from './dialog';

function DialogPreview({initiallyOpen, longContent = false}: {
  initiallyOpen: boolean;
  longContent?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const paragraphs = longContent ?
    Array.from({length: 12}) : Array.from({length: 1});

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Abrir planos
      </Button>
      <Dialog
        closeLabel="Fechar planos"
        onClose={() => setOpen(false)}
        open={open}
        title="Escolha seu plano"
      >
        <p className="text-sm text-content-secondary">
          Compare as opções antes de continuar.
        </p>
        {paragraphs.map((_, index) => (
          <p className="mt-4 text-sm text-content-secondary" key={index}>
            Cada plano oferece controles e limites adequados ao contexto da sua
            equipe.
          </p>
        ))}
      </Dialog>
    </>
  );
}

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  args: {
    children: null,
    closeLabel: 'Fechar planos',
    onClose: () => undefined,
    open: false,
    title: 'Escolha seu plano',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => <DialogPreview initiallyOpen={false} />,
};

export const LongContent: Story = {
  render: () => <DialogPreview initiallyOpen longContent />,
};
