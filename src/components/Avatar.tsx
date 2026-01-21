import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';
import type { Options } from '@dicebear/avataaars';

interface AvatarProps {
  seed?: string | number;
  size?: number;
  className?: string;
}

// 随机选择数组中的一个元素
function randomChoice<T extends readonly any[]>(array: T): T[number] {
  return array[Math.floor(Math.random() * array.length)];
}

// 生成随机的十六进制颜色（带#前缀）
function randomHexColor(): string {
  return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// 生成随机概率 (0-100)
function randomProbability(): number {
  return Math.floor(Math.random() * 101);
}

// Avataaars所有可用参数的选项
const AVATAAARS_OPTIONS = {
  // 风格选项
  style: ['circle', 'default'] as const,
  
  // 服装选项
  clothing: [
    'blazerAndShirt', 'blazerAndSweater', 'collarAndSweater',
    'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck',
    'shirtScoopNeck', 'shirtVNeck'
  ] as const,
  
  // 面部特征选项
  mouth: [
    'concerned', 'default', 'disbelief', 'eating', 'grimace',
    'sad', 'screamOpen', 'serious', 'smile', 'tongue',
    'twinkle', 'vomit'
  ] as const,
  
  eyes: [
    'closed', 'cry', 'default', 'eyeRoll', 'happy', 'hearts',
    'side', 'squint', 'surprised', 'winkWacky', 'wink', 'xDizzy'
  ] as const,
  
  eyebrows: [
    'angryNatural', 'defaultNatural', 'flatNatural', 'frownNatural',
    'raisedExcitedNatural', 'sadConcernedNatural', 'unibrowNatural',
    'upDownNatural', 'angry', 'default', 'raisedExcited',
    'sadConcerned', 'upDown'
  ] as const,
  
  // 顶部（头发/帽子）选项
  top: [
    'hat', 'hijab', 'turban', 'winterHat1', 'winterHat02',
    'winterHat03', 'winterHat04', 'bob', 'bun', 'curly',
    'curvy', 'dreads', 'frida', 'fro', 'froBand',
    'longButNotTooLong', 'miaWallace', 'shavedSides', 'straight02',
    'straight01', 'straightAndStrand', 'dreads01', 'dreads02',
    'frizzle', 'shaggy', 'shaggyMullet', 'shortCurly', 'shortFlat',
    'shortRound', 'shortWaved', 'sides', 'theCaesar',
    'theCaesarAndSidePart', 'bigHair'
  ] as const,
  
  // 面部毛发选项
  facialHair: [
    'beardLight', 'beardMajestic', 'beardMedium',
    'moustacheFancy', 'moustacheMagnum'
  ] as const,
  
  // 配饰选项
  accessories: [
    'kurt', 'prescription01', 'prescription02', 'round',
    'sunglasses', 'wayfarers', 'eyepatch'
  ] as const,
  
  // 服装图案选项
  clothingGraphic: [
    'bat', 'bear', 'cumbia', 'deer', 'diamond',
    'hola', 'pizza', 'resist', 'skull', 'skullOutline'
  ] as const
};

export default function Avatar({ size = 40, className = '' }: AvatarProps) {
  // 使用useMemo缓存头像数据，只有当seed或size变化时才重新生成
  const avatarSvg = useMemo(() => {
    // 如果没有提供seed，生成一个随机seed并保持稳定
    // const stableSeed = seed || Math.random().toString(36).substring(2, 15);

    // 随机选择所有参数，确保符合Options类型
    const options: Options = {
      style: [randomChoice(AVATAAARS_OPTIONS.style)],
      base: ['default'],
      // 面部特征
      mouth: [randomChoice(AVATAAARS_OPTIONS.mouth)],
      nose: ['default'],
      eyes: [randomChoice(AVATAAARS_OPTIONS.eyes)],
      eyebrows: [randomChoice(AVATAAARS_OPTIONS.eyebrows)],
      // 服装
      clothing: [randomChoice(AVATAAARS_OPTIONS.clothing)],
      clothingGraphic: [randomChoice(AVATAAARS_OPTIONS.clothingGraphic)],
      // 顶部（头发/帽子）
      top: [randomChoice(AVATAAARS_OPTIONS.top)],
      topProbability: 100, // 总是显示顶部
      // 面部毛发
      facialHair: [randomChoice(AVATAAARS_OPTIONS.facialHair)],
      facialHairProbability: randomProbability(),
      // 配饰
      accessories: [randomChoice(AVATAAARS_OPTIONS.accessories)],
      accessoriesProbability: randomProbability(),
      // 颜色
      accessoriesColor: [randomHexColor()],
      clothesColor: [randomHexColor()],
      hatColor: [randomHexColor()],
      hairColor: [randomHexColor()],
      skinColor: [randomHexColor()],
      facialHairColor: [randomHexColor()],
      backgroundColor: [randomHexColor()],
    };

    return createAvatar(avataaars, options).toDataUri();
  }, [size]);

  return (
    <img
      src={avatarSvg}
      alt="Random Avatar"
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}