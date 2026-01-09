import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, auth } from '../../../../config/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ClassDetailsStudent() {
  const { classId } = useLocalSearchParams();
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    fetchClassDetails();
    animateIn();
  }, [classId]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      // Fetch class data
      const classDoc = await getDoc(doc(db, 'classes', classId));
      if (!classDoc.exists()) throw new Error('Class not found');

      // Verify student is enrolled (approved join request)
      const joinQuery = query(
        collection(db, 'join_requests'),
        where('studentId', '==', doc(db, 'users', userId)),
        where('classId', '==', doc(db, 'classes', classId)),
        where('status', '==', 'approved')
      );
      const joinSnapshot = await getDocs(joinQuery);
      if (joinSnapshot.empty) throw new Error('Not enrolled in this class');

      setClassData({ id: classDoc.id, ...classDoc.data() });
    } catch (error) {
      console.error('Error fetching class details:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClass = async () => {
    Alert.alert(
      'Leave Class',
      'Are you sure you want to leave this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const userId = auth.currentUser?.uid;
              const joinQuery = query(
                collection(db, 'join_requests'),
                where('studentId', '==', doc(db, 'users', userId)),
                where('classId', '==', doc(db, 'classes', classId))
              );
              const joinSnapshot = await getDocs(joinQuery);
              joinSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
              });
              Alert.alert('Success', 'You have left the class');
              router.push('/(sidebar)/student/myclasses');
            } catch (error) {
              console.error('Error leaving class:', error);
              Alert.alert('Error', 'Failed to leave class');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleViewAssignments = () => {
    router.push(`/(sidebar)/student/assignments/${classId}`);
  };

  const LoadingState = () => (
    <View style={styles.loadingContainer}>
      <Ionicons name="refresh" size={isTablet ? 32 : 24} color="#4467EE" />
      <Text style={styles.loadingText}>Loading class details...</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (!classData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={isTablet ? 60 : 48} color="#F44336" />
          <Text style={styles.errorText}>Class not found or not enrolled</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(sidebar)/student/myclasses')}
          >
            <Text style={styles.backButtonText}>Back to My Classes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(sidebar)/student/myclasses')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={isTablet ? 24 : 20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{classData.className}</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Animated.View
          style={[
            styles.classCard,
     
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.subjectBadge}>
              <Ionicons name="book-outline" size={isTablet ? 14 : 12} color="#4467EE" />
              <Text style={styles.subjectText}>{classData.subject}</Text>
            </View>
            <View style={styles.classCodeContainer}>
              <Ionicons name="qr-code-outline" size={isTablet ? 14 : 12} color="#666" />
              <Text style={styles.classCode}>{classData.classCode}</Text>
            </View>
          </View>

          <Text style={styles.description}>{classData.description}</Text>

          <View style={styles.qrCodeContainer}>
            {/* Placeholder for QR Code */}
            <View style={styles.qrCodePlaceholder}>
              
               <View style={styles.container}>
                <Image
                  source={{ uri: classData?.qrCodeUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          <View style={styles.pricingContainer}>
            <View style={styles.pricingIcon}>
              <Ionicons name="cash" size={isTablet ? 16 : 14} color="#FF9800" />
            </View>
            <Text style={styles.pricingText}>
              Monthly Fee: ₹{classData.monthlyFee}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewAssignments}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={isTablet ? 20 : 18} color="#fff" />
            <Text style={styles.actionButtonText}>View Assignments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeaveClass}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Ionicons name="exit" size={isTablet ? 20 : 18} color="#fff" />
            <Text style={styles.actionButtonText}>Leave Class</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backButton: {
    padding: isTablet ? 10 : 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
   image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  placeholder: {
    width: isTablet ? 40 : 32, // Balances header layout
  },
  scrollContainer: {
    flex: 1,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isTablet ? 20 : 16,
    margin: isTablet ? 20 : 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  subjectText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: '#4467EE',
  },
  classCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classCode: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'monospace',
  },
  description: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    lineHeight: isTablet ? 24 : 20,
    marginBottom: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 150,
    padding: isTablet ? 16 : 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  qrCodePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: isTablet ? 140 : 120,
    height: isTablet ? 140 : 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  qrCodeText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  qrCodeNote: {
    fontSize: isTablet ? 12 : 11,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: isTablet ? 12 : 10,
    borderRadius: 8,
    gap: 8,
  },
  pricingIcon: {
    width: isTablet ? 32 : 28,
    height: isTablet ? 32 : 28,
    borderRadius: isTablet ? 16 : 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pricingText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 20 : 16,
    gap: isTablet ? 16 : 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: isTablet ? 16 : 12,
    borderRadius: 8,
    gap: 8,
  },
  leaveButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#F44336',
    marginVertical: 16,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#4467EE',
  },
});