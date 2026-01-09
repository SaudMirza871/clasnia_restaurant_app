import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../../../config/firebaseConfig';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ClassDetails() {
  const { classId, students } = useLocalSearchParams();
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [studentList, setStudentList] = useState(students ? JSON.parse(students) : []);
  const [joinRequests, setJoinRequests] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    fetchClassDetails();
    animateIn();
  }, [classId]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const classDoc = await getDoc(doc(db, 'classes', classId));
      if (!classDoc.exists()) {
        throw new Error('Class not found');
      }
      setClassData({ id: classDoc.id, ...classDoc.data() });

      const requestsSnapshot = await getDocs(
        query(
          collection(db, 'join_requests'),
          where('classId', '==', doc(db, 'classes', classId))
        )
      );
      const requestsData = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        studentName: doc.data().studentName || 'Unknown Student',
      }));

      const pendingRequests = requestsData.filter((req) => req.status === 'pending');
      const approvedRequests = requestsData.filter((req) => req.status === 'approved');
      setJoinRequests(pendingRequests);
      setApprovedStudents(approvedRequests);
    } catch (error) {
      console.error('Error fetching class details:', error);
      Alert.alert('Error', `Failed to load class details: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClassDetails();
  };

  const handleViewRequest = (request) => {
    router.push({
      pathname: '/(sidebar)/teacher/approval',
      params: {
        requestId: request.id,
        classId: request.classId.id,
        studentId: request.studentId.id,
        studentName: request.studentName,
        screenshotUrl: request.screenshotUrl,
        transactionId: request.transactionId,
        gender: request.gender,
        phone: request.phone.toString(),
        rollNumber: request.rollNumber,
        requestedAt: request.requestedAt.toDate().toISOString(),
      },
    });
  };

  const handleInviteStudents = () => {
    router.push({
      pathname: '/(sidebar)/teacher/invite',
      params: { classId, classCode: classData.classCode },
    });
  };

  const AnimatedStudentCard = ({ item, index }) => {
    const cardAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
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
          styles.studentCard,
          {
            opacity: cardAnim,
            transform: [
              { scale: scaleAnim },
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.studentCardContent}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.studentAvatarContainer}>
            <View style={styles.studentAvatar}>
              <Ionicons name="person" size={isTablet ? 24 : 20} color="#4467EE" />
            </View>
            <View style={styles.studentStatusBadge}>
              <View style={styles.statusDot} />
            </View>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentId}>ID: {item.id.slice(0, 8)}...</Text>
          </View>
          <Ionicons name="chevron-forward" size={isTablet ? 20 : 16} color="#ccc" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const AnimatedRequestCard = ({ item, index }) => {
    const cardAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
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
          styles.requestCard,
          {
            opacity: cardAnim,
            transform: [
              { scale: scaleAnim },
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.requestCardContent}
          onPress={() => handleViewRequest(item)}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.requestHeader}>
            <View style={styles.requestAvatarContainer}>
              <View style={styles.requestAvatar}>
                <Ionicons name="person-add" size={isTablet ? 22 : 18} color="#FF9800" />
              </View>
              <View style={styles.pendingBadge}>
                <View style={styles.pendingDot} />
              </View>
            </View>
            <View style={styles.requestInfo}>
              <Text style={styles.requestName}>{item.studentName}</Text>
              <Text style={styles.requestRoll}>Roll: {item.rollNumber}</Text>
              <Text style={styles.requestTime}>
                {new Date(item.requestedAt.toDate()).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.reviewButtonContainer}>
              <View style={styles.reviewButton}>
                <Ionicons name="eye" size={isTablet ? 16 : 14} color="#fff" />
                <Text style={styles.reviewButtonText}>Review</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = ({ icon, title, subtitle, action, onAction }) => {
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
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons name={icon} size={isTablet ? 60 : 40} color="#ccc" />
          {action && (
            <View style={styles.emptyIconBadge}>
              <Ionicons name="add" size={isTablet ? 20 : 16} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
        {action && (
          <TouchableOpacity
            style={[styles.emptyActionButton, { transform: [{ scale: buttonAnim }] }]}
            onPress={onAction}
            activeOpacity={0.8}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Ionicons name="add-circle" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={styles.emptyActionText}>{action}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  const LoadingState = () => (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[
          styles.loadingSpinner,
          {
            transform: [
              {
                rotate: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="refresh" size={isTablet ? 40 : 32} color="#4467EE" />
      </Animated.View>
      <Text style={styles.loadingText}>Loading class details...</Text>
    </View>
  );

  if (loading && !classData) {
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
          <Ionicons name="alert-circle" size={isTablet ? 80 : 60} color="#F44336" />
          <Text style={styles.errorText}>Class not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(sidebar)/teacher/myclasses')}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalStudents = studentList.length + approvedStudents.length;
  const allStudents = [
    ...studentList,
    ...approvedStudents.map((req) => ({
      id: req.studentId.id,
      name: req.studentName,
    })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4467EE" />
      <Animated.View
        style={[
          styles.header,
         
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(sidebar)/teacher/myclasses')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {classData.className}
          </Text>
          <Text style={styles.headerSubtitle}>{classData.subject}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={isTablet ? 24 : 20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4467EE']}
            tintColor="#4467EE"
            progressViewOffset={20}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          style={[
            styles.classCard,
           
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.subjectBadge}>
              <Ionicons name="book" size={isTablet ? 14 : 12} color="#4467EE" />
              <Text style={styles.subjectText}>{classData.subject}</Text>
            </View>
            <View style={styles.classCodeContainer}>
              <Ionicons name="qr-code" size={isTablet ? 14 : 12} color="#666" />
              <Text style={styles.classCode}>{classData.classCode}</Text>
            </View>
          </View>

          <Text style={styles.classDescription}>{classData.description}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="people" size={isTablet ? 20 : 16} color="#4467EE" />
              </View>
              <Text style={styles.statNumber}>{totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="cash" size={isTablet ? 20 : 16} color="#FF9800" />
              </View>
              <Text style={styles.statNumber}>₹{classData.monthlyFee}</Text>
              <Text style={styles.statLabel}>Monthly Fee</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="calendar" size={isTablet ? 20 : 16} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>
                {new Date(classData.createdDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.statLabel}>Created</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="people" size={isTablet ? 24 : 20} color="#4467EE" />
              <Text style={styles.sectionTitle}>Enrolled Students</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{totalStudents}</Text>
            </View>
          </View>

          {totalStudents === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No Enrollments"
              subtitle="Invite students to join your class using the class code."
              action="Invite Students"
              onAction={handleInviteStudents}
            />
          ) : (
            <View style={styles.studentsContainer}>
              {allStudents.map((student, index) => (
                <AnimatedStudentCard
                  key={student.id}
                  item={student}
                  index={index}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="person-add" size={isTablet ? 24 : 20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Pending Requests</Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.countText, { color: '#FF9800' }]}>
                {joinRequests.length}
              </Text>
            </View>
          </View>

          {joinRequests.length === 0 ? (
            <EmptyState
              icon="person-add-outline"
              title="No Pending Requests"
              subtitle="New join requests will appear here for your review."
            />
          ) : (
            <View style={styles.requestsContainer}>
              {joinRequests.map((request, index) => (
                <AnimatedRequestCard
                  key={request.id}
                  item={request}
                  index={index}
                />
              ))}
            </View>
          )}
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
    alignItems: 'center',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 20 : 16,
    backgroundColor: '#4467EE',
    shadowColor: '',
    shadowOffset: { width: 0, height: 4 },
    
  },
  backButton: {
    padding: isTablet ? 12 : 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: isTablet ? 20 : 12,
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  moreButton: {
    padding: isTablet ? 12 : 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollContainer: {
    flex: 1,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isTablet ? 24 : 16,
    margin: isTablet ? 24 : 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E3F2FD',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4467EE',
  },
  subjectText: {
    color: '#4467EE',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  classCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classCode: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  classDescription: {
    fontSize: isTablet ? 18 : 16,
    color: '#444',
    marginBottom: 16,
    lineHeight: isTablet ? 26 : 22,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isTablet ? 16 : 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: isTablet ? 20 : 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  statIconContainer: {
    width: isTablet ? 40 : 32,
    height: isTablet ? 40 : 32,
    borderRadius: isTablet ? 20 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  statNumber: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: {
    marginHorizontal: isTablet ? 24 : 16,
    marginBottom: isTablet ? 32 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  countBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4467EE',
  },
  countText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
    color: '#4467EE',
  },
  studentsContainer: {
    gap: isTablet ? 16 : 12,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  studentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
  },
  studentAvatarContainer: {
    position: 'relative',
  },
  studentAvatar: {
    width: isTablet ? 52 : 44,
    height: isTablet ? 52 : 44,
    borderRadius: isTablet ? 26 : 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4467EE',
  },
  studentStatusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: isTablet ? 20 : 16,
    height: isTablet ? 20 : 16,
    borderRadius: isTablet ? 10 : 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  statusDot: {
    width: isTablet ? 10 : 8,
    height: isTablet ? 10 : 8,
    borderRadius: isTablet ? 5 : 4,
    backgroundColor: '#4CAF50',
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  studentId: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  requestsContainer: {
    gap: isTablet ? 16 : 12,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF3E0',
  },
  requestCardContent: {
    padding: isTablet ? 20 : 16,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestAvatarContainer: {
    position: 'relative',
  },
  requestAvatar: {
    width: isTablet ? 52 : 44,
    height: isTablet ? 52 : 44,
    borderRadius: isTablet ? 26 : 22,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  pendingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: isTablet ? 20 : 16,
    height: isTablet ? 20 : 16,
    borderRadius: isTablet ? 10 : 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  pendingDot: {
    width: isTablet ? 10 : 8,
    height: isTablet ? 10 : 8,
    borderRadius: isTablet ? 5 : 4,
    backgroundColor: '#FF9800',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  requestName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  requestRoll: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  requestTime: {
    fontSize: isTablet ? 13 : 11,
    color: '#999',
    fontWeight: '400',
  },
  reviewButtonContainer: {
    marginLeft: 12,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: 10,
    gap: 8,
    elevation: 3,
    shadowColor: '#4467EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: isTablet ? 48 : 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    position: 'relative',
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: isTablet ? 50 : 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  emptyIconBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: isTablet ? 28 : 24,
    height: isTablet ? 28 : 24,
    borderRadius: isTablet ? 14 : 12,
    backgroundColor: '#4467EE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
    marginBottom: 16,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    gap: 10,
    elevation: 4,
    shadowColor: '#4467EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: isTablet ? 18 : 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '700',
    color: '#F44336',
    marginVertical: 16,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#4467EE',
  },
});