import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 35,
    lineHeight: 42,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.8,
    color: '#000000',
  },
  title1: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    color: '#000000',
  },
  title2: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: '#000000',
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: '#5F5F59',
  },
  bodyRegular: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: '#5F5F59',
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: '#5F5F59',
  },
};
