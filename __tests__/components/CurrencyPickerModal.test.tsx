import React from 'react';
import {act, create} from 'react-test-renderer';
import {Pressable, Text} from 'react-native';
import CurrencyPickerModal from '../../src/components/CurrencyPickerModal';

const CURRENCIES = [
  {code: 'USD', name: 'US Dollar'},
  {code: 'EUR', name: 'Euro'},
  {code: 'GBP', name: 'British Pound'},
];

function renderModal(props: Partial<React.ComponentProps<typeof CurrencyPickerModal>> = {}) {
  const defaultProps = {
    visible: true,
    currencies: CURRENCIES,
    selectedCode: 'USD',
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...props,
  };
  let renderer: ReturnType<typeof create>;
  act(() => {
    renderer = create(<CurrencyPickerModal {...defaultProps} />);
  });
  return {renderer: renderer!, ...defaultProps};
}

describe('CurrencyPickerModal', () => {
  it('renders without crashing', () => {
    const {renderer} = renderModal();
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('shows all currency codes when there is no search query', () => {
    const {renderer} = renderModal();
    const json = JSON.stringify(renderer.toJSON());
    expect(json).toContain('USD');
    expect(json).toContain('EUR');
    expect(json).toContain('GBP');
  });

  it('marks the currently selected currency', () => {
    const {renderer} = renderModal({selectedCode: 'EUR'});
    const texts = renderer.root.findAllByType(Text);
    const hasCheckmark = texts.some(t => t.props.children === '✓');
    expect(hasCheckmark).toBe(true);
  });

  it('calls onSelect and onClose when a currency row is pressed', () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    const {renderer} = renderModal({onSelect, onClose});

    // Find the Text node for 'EUR', then walk up to its Pressable ancestor.
    const eurText = renderer.root
      .findAllByType(Text)
      .find(t => t.props.children === 'EUR');
    expect(eurText).toBeDefined();

    let node: typeof eurText | null = eurText!;
    while (node && node.type !== Pressable) {
      node = node.parent as typeof eurText;
    }
    expect(node).toBeDefined();
    act(() => {
      (node as any).props.onPress();
    });
    expect(onSelect).toHaveBeenCalledWith('EUR');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the close button is pressed', () => {
    const onClose = jest.fn();
    const {renderer} = renderModal({onClose});

    const closeText = renderer.root
      .findAllByType(Text)
      .find(t => t.props.children === '✕');
    expect(closeText).toBeDefined();

    let node: typeof closeText | null = closeText!;
    while (node && node.type !== Pressable) {
      node = node.parent as typeof closeText;
    }
    expect(node).toBeDefined();
    act(() => {
      (node as any).props.onPress();
    });
    expect(onClose).toHaveBeenCalled();
  });
});
