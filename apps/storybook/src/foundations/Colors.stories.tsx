import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPalette } from './ColorPalette';

const meta = {
  title: 'Fundamentos/Cores',
  component: ColorPalette,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ColorPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Semanticas: Story = { name: 'Semânticas', args: { kind: 'semantic' } };

export const Primitivas: Story = { args: { kind: 'primitive' } };
