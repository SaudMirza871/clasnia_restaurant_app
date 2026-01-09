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
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db, auth } from '../../../config/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function MyClassesStudent() {
  const router = useRouter();
  const [classes, setClasses] = useState({ approved: [], pending: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    fetchClasses();
    animateIn();
  }, []);

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

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      // Fetch join requests for the current student
      const requestsQuery = query(
        collection(db, 'join_requests'),
        where('studentId', '==', doc(db, 'users', userId))
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsData = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Separate approved and pending requests
      const approvedRequests = requestsData.filter((req) => req.status === 'approved');
      const pendingRequests = requestsData.filter((req) => req.status === 'pending');

      // Fetch class details for approved and pending requests
      const approvedClasses = await Promise.all(
        approvedRequests.map(async (req) => {
          const classDoc = await getDoc(req.classId);
          return classDoc.exists() ? { id: classDoc.id, ...classDoc.data() } : null;
        })
      );
      const pendingClasses = await Promise.all(
        pendingRequests.map(async (req) => {
          const classDoc = await getDoc(req.classId);
          return classDoc.exists() ? { id: classDoc.id, ...classDoc.data() } : null;
        })
      );

      setClasses({
        approved: approvedClasses.filter((cls) => cls !== null),
        pending: pendingClasses.filter((cls) => cls !== null),
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
      Alert.alert('Error', 'Failed to load classes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const handleViewDetails = (classId) => {
    router.push(`/(sidebar)/student/classdetails/${classId}`);
  };

  const handleJoinClass = () => {
    router.push('/(sidebar)/student/joinclass');
  };

  const AnimatedClassCard = ({ classData, index, status }) => {
    const cardAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.classCard,
          {
            opacity: cardAnim,
            transform: [
              { scale: scaleAnim },
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => status === 'approved' && handleViewDetails(classData.id)}
          activeOpacity={0.8}
          disabled={status === 'pending'}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.className} numberOfLines={1}>
              {classData.className}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: status === 'approved' ? '#E8F5E8' : '#FFF3E0' },
              ]}
            >
              <Ionicons
                name={status === 'approved' ? 'checkmark-circle' : 'hourglass'}
                size={isTablet ? 14 : 12}
                color={status === 'approved' ? '#4CAF50' : '#FF9800'}
              />
              <Text style={styles.statusText}>
                {status === 'approved' ? 'Enrolled' : 'Pending'}
              </Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.subjectContainer}>
              <Ionicons name="book-outline" size={isTablet ? 16 : 14} color="#4467EE" />
              <Text style={styles.subjectText}>{classData.subject}</Text>
            </View>
            <Text style={styles.classCode}>Code: {classData.classCode}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => {
    const buttonAnim = new Animated.Value(1);

    const handleButtonPressIn = () => {
      Animated.spring(buttonAnim, {
        toValue: 0.95,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    const handleButtonPressOut = () => {
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.emptyState,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons name="school-outline" size={isTablet ? 60 : 48} color="#4467EE" />
        </View>
        <Text style={styles.emptyTitle}>No Classes Joined</Text>
        <Text style={styles.emptySubtitle}>
          Join a class using a class code to start learning!
        </Text>
        <TouchableOpacity
          style={[styles.joinButton, { transform: [{ scale: buttonAnim }] }]}
          onPress={handleJoinClass}
          activeOpacity={0.8}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Ionicons name="add-circle" size={isTablet ? 20 : 18} color="#fff" />
          <Text style={styles.joinButtonText}>Join a Class</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>My Classes</Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinClass}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={isTablet ? 20 : 18} color="#fff" />
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4467EE']}
            tintColor="#4467EE"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={isTablet ? 32 : 24} color="#4467EE" />
            <Text style={styles.loadingText}>Loading classes...</Text>
          </View>
        ) : classes.approved.length === 0 && classes.pending.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.classesContainer}>
            {classes.approved.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Enrolled Classes</Text>
                {classes.approved.map((classData, index) => (
                  <AnimatedClassCard
                    key={classData.id}
                    classData={classData}
                    index={index}
                    status="approved"
                  />
                ))}
              </>
            )}
            {classes.pending.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: isTablet ? 24 : 16 }]}>
                  Pending Classes
                </Text>
                {classes.pending.map((classData, index) => (
                  <AnimatedClassCard
                    key={classData.id}
                    classData={classData}
                    index={index + classes.approved.length}
                    status="pending"
                  />
                ))}
              </>
            )}
          </View>
        )}
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
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: '#333',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: 8,
    gap: 6,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  classesContainer: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  cardContent: {
    padding: isTablet ? 16 : 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '600',
    color: '#333',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectText: {
    fontSize: isTablet ? 14 : 13,
    color: '#666',
    fontWeight: '500',
  },
  classCode: {
    fontSize: isTablet ? 13 : 12,
    color: '#666',
    fontFamily: 'monospace',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isTablet ? 80 : 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: isTablet ? 80 : 64,
    height: isTablet ? 80 : 64,
    borderRadius: isTablet ? 40 : 32,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: isTablet ? 15 : 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: isTablet ? 22 : 20,
    marginBottom: 16,
  },
});