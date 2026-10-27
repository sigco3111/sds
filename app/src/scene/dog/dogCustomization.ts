// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Matthew Kissinger
/**
 * Working sheepdog coat presets and color ladders.
 * Authored using the same Khronos Neutral inverse palette standards as coatTones.ts.
 */

import { COAT_SHADOW, OUTLINE } from './coatTones';

export type DogCoatId = 'classic' | 'red' | 'merle' | 'chocolate' | 'golden';

export interface DogCoatPreset {
  readonly id: DogCoatId;
  readonly name: string;
  readonly description: string;
  readonly swatch: string;
  readonly shadow: string;
  readonly mid: string;
  readonly lit: string;
  readonly outline: string;
}

export const DOG_COAT_PRESETS: Readonly<Record<DogCoatId, DogCoatPreset>> = {
  classic: {
    id: 'classic',
    name: '클래식 흑백',
    description: '숯검정 털에 흰색 테두리가 있는 전통적인 양몰이 보더 콜리.',
    swatch: '#36302a',
    shadow: COAT_SHADOW,
    mid: '#5c5246',
    lit: '#766654',
    outline: OUTLINE,
  },
  red: {
    id: 'red',
    name: '적백 (세이블)',
    description: '따뜻한 적갈색-호박색에 밝은 밤색 톤의 양몰이 콜리.',
    swatch: '#8c4826',
    shadow: '#422415',
    mid: '#7d4323',
    lit: '#a65d35',
    outline: '#2b1207',
  },
  merle: {
    id: 'merle',
    name: '블루 멀',
    description: '청회색과 차가운 숯색 얼룩에 선명한 흰 무늬.',
    swatch: '#636c7a',
    shadow: '#353940',
    mid: '#626975',
    lit: '#87909e',
    outline: '#22242a',
  },
  chocolate: {
    id: 'chocolate',
    name: '초콜릿 / 리버',
    description: '따뜻한 바탕톤의 짙은 코코아와 다크 초콜릿 털.',
    swatch: '#5a3b2c',
    shadow: '#2b1c15',
    mid: '#58392a',
    lit: '#79513e',
    outline: '#1c100a',
  },
  golden: {
    id: 'golden',
    name: '골든 위튼',
    description: '꿀처럼 빛나는 목초지 금색 털에 부드러운 크림색 무늬.',
    swatch: '#b3864c',
    shadow: '#5e4222',
    mid: '#997341',
    lit: '#c2995e',
    outline: '#3c2710',
  },
};

export const DEFAULT_DOG_COAT: DogCoatId = 'classic';
export const DEFAULT_DOG_NAME = 'Pip';

export const WORKING_DOG_NAMES: readonly string[] = [
  '까미',
  '바둑이',
  '몽이',
  '누렁이',
  '초롱이',
  '들풀',
  '바람이',
  '메리',
  '로이',
  '캡',
  '보리',
  '페퍼',
  '버스터',
  '하늘이',
  '안개',
  '제드',
  '넬',
  '벤',
  '웅이',
  '집',
];

export function getRandomDogName(): string {
  const idx = Math.floor(Math.random() * WORKING_DOG_NAMES.length);
  return WORKING_DOG_NAMES[idx] ?? DEFAULT_DOG_NAME;
}
