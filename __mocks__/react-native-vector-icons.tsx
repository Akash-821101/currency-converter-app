import React from 'react';
import {Text} from 'react-native';

const Icon = ({name, size, color}: {name: string; size?: number; color?: string}) => (
  <Text style={{fontSize: size, color}}>{name}</Text>
);

export default Icon;
