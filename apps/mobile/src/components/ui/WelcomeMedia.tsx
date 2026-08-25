import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';

interface WelcomeMediaProps {
  videoUri?: string;
  posterUri?: string;
}

export const WelcomeMedia: React.FC<WelcomeMediaProps> = ({
  // Vidéo MP4 d'ambiance fiable
  videoUri = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  // Image chaleureuse et lumineuse (jeunes amis souriants avec téléphone)
  posterUri = 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1200&auto=format&fit=crop',
}) => {
  const [videoError, setVideoError] = useState(false);

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Image de couverture en arrière-plan immédiat */}
      <Image
        source={{ uri: posterUri }}
        style={[StyleSheet.absoluteFill, styles.coverImage]}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* 2. Lecteur Vidéo Expo Video (SDK 57) */}
      {!videoError && videoUri ? (
        <VideoView
          style={StyleSheet.absoluteFill}
          player={player}
          contentFit="cover"
          nativeControls={false}
          surfaceType="textureView" // INDISPENSABLE SUR ANDROID POUR AFFICHER LES BOUTONS PAR-DESSUS !
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
  },
});
