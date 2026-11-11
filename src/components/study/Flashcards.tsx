import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  cards: { front: string; back: string }[];
}

export function Flashcards({ cards }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const go = (next: number) => {
    setIndex(next);
    setFlipped(false);
  };

  return (
    <View style={{ gap: spacing.md }}>
      <Text variant="label" color={colors.mutedForeground}>
        Card {index + 1} of {cards.length} · tap to flip
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={flipped ? 'Show question' : 'Show answer'}
        activeOpacity={0.9}
        onPress={() => setFlipped((f) => !f)}
      >
        <Card
          style={{
            minHeight: 200,
            justifyContent: 'center',
            backgroundColor: flipped ? colors.inverseSurface : colors.card,
          }}
        >
          <Text variant="label" color={flipped ? colors.inverseOnSurface : colors.mutedForeground}>
            {flipped ? 'Answer' : 'Question'}
          </Text>
          <Text variant="h4" color={flipped ? colors.inverseOnSurface : colors.foreground}>
            {flipped ? card.back : card.front}
          </Text>
        </Card>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Button
          label="Previous"
          variant="outline"
          disabled={index === 0}
          onPress={() => go(index - 1)}
          style={{ flex: 1 }}
        />
        <Button
          label="Next"
          disabled={index === cards.length - 1}
          onPress={() => go(index + 1)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
