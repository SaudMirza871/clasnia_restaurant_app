import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
import { useRouter } from "expo-router";
import useUserInfo from "../hooks/useUserInfo";

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(50)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(30)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  // Floating particles animations
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;

 const router = useRouter();
const { userInfo, loading } = useUserInfo();

useEffect(() => {
  startAnimations();
  startFloatingParticles();
}, []);

useEffect(() => {
  if (!loading) {
    setTimeout(() => {
      console.log("User Info at splash", userInfo);
      if (userInfo?.role === "Tuition Teacher") {
        router.replace("/(sidebar)/teacher/dashboard");
      } else if (userInfo?.role === "Student") {
        router.replace("/(sidebar)/student/dashboard");
      } else {
        router.replace("/auth/signin");
      }
    }, 5500);
  }
}, [loading, userInfo]);


  const startAnimations = () => {
    // Logo animation
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo rotation (continuous)
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation (continuous)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Text animations with delays
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    setTimeout(() => {
      Animated.timing(featuresOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1200);

    // Loading bar animation
    setTimeout(() => {
      Animated.timing(loadingWidth, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, 1600);
  };

  const startFloatingParticles = () => {
    // Floating animations for particles
    const animateParticle = (animatedValue:any, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: -20,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 20,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateParticle(particle1Y, 0);
    animateParticle(particle2Y, 600);
    animateParticle(particle3Y, 1200);
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadingWidthInterpolate = loadingWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Floating Particles */}
      <Animated.View 
        style={[
          styles.particle, 
          styles.particle1,
          { transform: [{ translateY: particle1Y }] }
        ]}
      />
      <Animated.View 
        style={[
          styles.particle, 
          styles.particle2,
          { transform: [{ translateY: particle2Y }] }
        ]}
      />
      <Animated.View 
        style={[
          styles.particle, 
          styles.particle3,
          { transform: [{ translateY: particle3Y }] }
        ]}
      />

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* Pulse Ring */}
          <Animated.View 
            style={[
              styles.pulseRing,
              {
                opacity: pulseOpacity,
                transform: [{ scale: logoScale }]
              }
            ]}
          />
          
          {/* Logo Container */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotateInterpolate }
                ]
              }
            ]}
          >
            <Ionicons name="school" size={48} color="#fff" />
          </Animated.View>
        </View>

        {/* Brand Name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}
        >
          <Text style={styles.brandName}>Clasnia</Text>
          <View style={styles.brandUnderline} />
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }]
            }
          ]}
        >
          <Text style={styles.tagline}>Empowering Education,</Text>
          <Text style={styles.taglineHighlight}>One Student at a Time</Text>
        </Animated.View>

        {/* Feature Icons */}
        <Animated.View
          style={[
            styles.featuresContainer,
            { opacity: featuresOpacity }
          ]}
        >
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={24} color="#4467EE" />
            </View>
            <Text style={styles.featureText}>Connect</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="book" size={24} color="#4467EE" />
            </View>
            <Text style={styles.featureText}>Learn</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <MaterialCommunityIcons name="trophy" size={24} color="#4467EE" />
            </View>
            <Text style={styles.featureText}>Achieve</Text>
          </View>
        </Animated.View>

        {/* Loading Section */}
        <View style={styles.loadingSection}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                { width: loadingWidthInterpolate }
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Designed By Sagar...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4467EE',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4467EE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4467EE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4467EE',
    textAlign: 'center',
    marginBottom: 8,
  },
  brandUnderline: {
    width: 80,
    height: 4,
    backgroundColor: '#4467EE',
    borderRadius: 2,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tagline: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
  },
  taglineHighlight: {
    fontSize: 18,
    color: '#4467EE',
    textAlign: 'center',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingSection: {
    alignItems: 'center',
    width: '80%',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#4467EE',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  // Floating Particles
  particle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.6,
  },
  particle1: {
    width: 16,
    height: 16,
    backgroundColor: '#4467EE',
    top: height * 0.2,
    left: width * 0.15,
  },
  particle2: {
    width: 12,
    height: 12,
    backgroundColor: '#6366F1',
    top: height * 0.3,
    right: width * 0.2,
  },
  particle3: {
    width: 20,
    height: 20,
    backgroundColor: '#8B5CF6',
    bottom: height * 0.25,
    left: width * 0.1,
  },
});

export default SplashScreen;