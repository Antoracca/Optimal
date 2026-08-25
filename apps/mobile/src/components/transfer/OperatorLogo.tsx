import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { CreditCard, Bank, MapPin } from 'phosphor-react-native';

type OperatorLogoProps = {
  id: string;
  size?: number;
};

export function OperatorLogo({ id, size = 52 }: OperatorLogoProps) {
  const containerStyle = [
    styles.container,
    { width: size, height: size, borderRadius: 14 },
  ];
  const imageSize = size - 8;

  switch (id) {
    // ── 1. CMI (CENTRE MONÉTIQUE INTERBANCAIRE) ──
    case 'cmi':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/cmi.png')}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 2. VISA ──
    case 'visa':
    case 'card_visa':
      return (
        <View style={containerStyle}>
          <Svg
            width={imageSize}
            height={Math.round((imageSize * 325) / 1000)}
            viewBox="0 0 1000 325"
          >
            <Path
              fill="#1A1F71"
              d="m 651.18503,0.50000002 c -70.93272,0 -134.32163,36.76584998 -134.32163,104.69357998 0,77.90028 112.42264,83.28082 112.42264,122.41576 0,16.47806 -18.88384,31.22851 -51.13668,31.22851 -45.77308,0 -79.98403,-20.61081 -79.98403,-20.61081 l -14.63836,68.54658 c 0,0 39.41037,17.40989 91.73375,17.40989 77.55217,0 138.57651,-38.57104 138.57651,-107.66029 0,-82.3157 -112.89106,-87.53633 -112.89106,-123.86008 0,-12.9082 15.50201,-27.05169 47.66251,-27.05169 36.28682,0 65.89216,14.98968 65.89216,14.98968 l 14.32608,-66.20444 c 0,0 -32.21317,-13.89668998 -77.64189,-13.89668998 z M 2.2175605,5.49657 0.49999253,15.48969 c 0,0 29.84159547,5.46149 56.71878047,16.35593 34.606624,12.4927 37.071853,19.7653 42.900167,42.35367 l 63.51098,244.83152 85.13673,0 131.15974,-313.53424 -84.94155,0 L 210.7069,218.67018 176.3165,37.97422 C 173.1626,17.29371 157.18709,5.49657 137.63219,5.49657 l -135.4146295,0 z m 411.8650095,0 -66.63383,313.53424 80.99895,0 66.39962,-313.53424 -80.76474,0 z m 451.75943,0 c -19.53181,0 -29.88045,10.45695 -37.47421,28.73022 l -118.66834,284.80402 84.94155,0 16.434,-47.46734 103.48348,0 9.99312,47.46734 74.94843,0 -65.3847,-313.53424 -68.27333,0 z m 11.04709,84.70733 25.17799,117.65341 -67.45359,0 42.2756,-117.65341 z"
            />
          </Svg>
        </View>
      );

    // ── 3. MASTERCARD ──
    case 'mastercard':
    case 'card_mastercard':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/mastercard.png')}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 4. CASH PLUS ──
    case 'cashplus':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/cashplus.png')}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 5. WAFACASH ──
    case 'wafacash':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/wafacash.jpg')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 6. ATTIJARIWAFA BANK ──
    case 'attijari':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/attijariwafa.jpg')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 7. CIH BANK ──
    case 'cih':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/cih.png')}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 8. SOCIÉTÉ GÉNÉRALE MAROC ──
    case 'societe_generale':
    case 'sgmb':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/societegenerale.png')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 9. BANQUE POPULAIRE (BCP) ──
    case 'banque_populaire':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/banquepopulaire.jpg')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 10. CRÉDIT AGRICOLE DU MAROC ──
    case 'credit_agricole':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/creditagricole.png')}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 11. BANK OF AFRICA (BMCE) ──
    case 'bmce':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/bankofafrica.png')}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 12. BMCI ──
    case 'bmci':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/banks/bmci.jpg')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 13. MTN MOBILE MONEY ──
    case 'mtn':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/operators/mtn.png')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 14. ORANGE MONEY ──
    case 'orange':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/operators/orange.png')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 15. AIRTEL MONEY ──
    case 'airtel':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/operators/airtel.png')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 16. MOOV MONEY ──
    case 'moov':
      return (
        <View style={containerStyle}>
          <Image
            source={require('../../../assets/operators/moov.png')}
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      );

    // ── 17. DÉPÔT EN POINT RELAIS ──
    case 'relay_deposit':
      return (
        <View style={[containerStyle, { backgroundColor: '#FFE500' }]}>
          <MapPin size={24} color="#111111" weight="fill" />
        </View>
      );

    // ── 18. CARTE GÉNÉRIQUE ──
    case 'card':
    case 'card_monetique':
      return (
        <View style={containerStyle}>
          <CreditCard size={26} color="#111111" weight="bold" />
        </View>
      );

    case 'bank':
      return (
        <View style={containerStyle}>
          <Bank size={26} color="#111111" weight="bold" />
        </View>
      );

    default:
      return (
        <View style={[styles.container, { width: size, height: size, borderRadius: 14, backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.fallbackText}>{id.slice(0, 2).toUpperCase()}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECE8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
});
