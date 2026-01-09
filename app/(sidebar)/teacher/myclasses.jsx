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
import { db } from '../../../config/firebaseConfig';
import { collection, getDocs, doc, query, where } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function MyClasses() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    fetchClasses();
    animateIn();
  }, []);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const classesSnapshot = await getDocs(collection(db, 'classes'));
      const classesData = classesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        totalStudents: doc.data().students?.length || 0,
        activeStudents: doc.data().students?.length || 0,
      }));
      setClasses(classesData);
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

  const handleViewDetails = async (classId) => {
    try {
      const classDoc = doc(db, 'classes', classId);
      const studentsSnapshot = await getDocs(
        query(collection(db, 'users'), where('classes', 'array-contains', classDoc))
      );
      const students = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || 'Unknown Student',
      }));

      router.push({
        pathname: `/(sidebar)/teacher/classdetails/${classId}`,
        params: { students: JSON.stringify(students) },
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students');
    }
  };

  const handleCreateClass = () => {
    router.push('/(sidebar)/teacher/createclass');
  };

  const AnimatedCard = ({ classData, index }) => {
    const cardAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);
    const shadowAnim = new Animated.Value(0.08);

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 150,
          useNativeDriver: false,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0.12,
          duration: 400,
          delay: index * 150,
          useNativeDriver: false,
        }),
      ]).start();
    }, []);

    const handlePressIn = () => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.97,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0.2,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const handlePressOut = () => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0.12,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
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
                  outputRange: [50, 0],
                }),
              },
            ],
            shadowOpacity: shadowAnim,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => handleViewDetails(classData.id)}
          style={styles.cardTouchable}
        >
          <View style={styles.cardHeader}>
            <View style={styles.headerTop}>
              <View style={styles.subjectBadge}>
                <Ionicons name="book-outline" size={isTablet ? 14 : 12} color="#4467EE" />
                <Text style={styles.subjectText}>{classData.subject}</Text>
              </View>
              <View style={styles.classCodeContainer}>
                <Ionicons name="qr-code-outline" size={isTablet ? 14 : 12} color="#666" />
                <Text style={styles.classCode}>{classData.classCode}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.className} numberOfLines={2}>
              {classData.className}
            </Text>
            <Text style={styles.classDescription} numberOfLines={3}>
              {classData.description}
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="people" size={isTablet ? 16 : 14} color="#4467EE" />
                </View>
                <View>
                  <Text style={styles.statNumber}>{classData.totalStudents}</Text>
                  <Text style={styles.statLabel}>Students</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[
                  styles.statIconContainer,
                  { backgroundColor: '#E8F5E8', borderColor: '#4CAF50' }
                ]}>
                  <Ionicons name="checkmark-circle" size={isTablet ? 16 : 14} color="#4CAF50" />
                </View>
                <View>
                  <Text style={styles.statNumber}>{classData.activeStudents}</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="cash" size={isTablet ? 16 : 14} color="#FF9800" />
                </View>
                <View>
                  <Text style={styles.statNumber}>₹{classData.monthlyFee}</Text>
                  <Text style={styles.statLabel}>Monthly</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewDetails(classData.id)}
              activeOpacity={0.8}
            >
              <Ionicons name="eye" size={isTablet ? 18 : 16} color="#fff" />
              <Text style={styles.viewButtonText}>View Details</Text>
              <Ionicons name="chevron-forward" size={isTablet ? 14 : 12} color="#fff" />
            </TouchableOpacity>
            <View style={styles.actionButtonsRight}>
              <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                <Ionicons name="create" size={isTablet ? 18 : 16} color="#4467EE" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                <Ionicons name="ellipsis-vertical" size={isTablet ? 18 : 16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const SummaryCard = ({ title, value, icon, color, delay }) => {
    const animValue = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay,
          useNativeDriver: false,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.summaryItem,
          {
            opacity: animValue,
            transform: [
              { scale: scaleAnim },
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.summaryIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={isTablet ? 24 : 20} color={color} />
        </View>
        <Text style={styles.summaryNumber}>{value}</Text>
        <Text style={styles.summaryLabel}>{title}</Text>
      </Animated.View>
    );
  };

  const EmptyState = () => {
    const buttonAnim = new Animated.Value(1);

    const handleButtonPressIn = () => {
      Animated.spring(buttonAnim, {
        toValue: 0.95,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    };

    const handleButtonPressOut = () => {
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
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
          <Ionicons name="school" size={isTablet ? 80 : 60} color="#4467EE" />
          <Animated.View
            style={[
              styles.emptyIconBadge,
              {
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name="add" size={isTablet ? 20 : 16} color="#fff" />
          </Animated.View>
        </View>
        <Text style={styles.emptyTitle}>No Classes Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first class to start teaching and managing your students
        </Text>
        <TouchableOpacity
          style={[styles.emptyActionButton, { transform: [{ scale: buttonAnim }] }]}
          onPress={handleCreateClass}
          activeOpacity={0.8}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Ionicons name="add-circle" size={isTablet ? 24 : 20} color="#fff" />
          <Text style={styles.emptyActionText}>Create First Class</Text>
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
          
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.title}>My Classes</Text>
          <Text style={styles.subtitle}>Organize and manage your teaching</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateClass}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={isTablet ? 20 : 18} color="#fff" />
          <Text style={styles.createButtonText}>New Class</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.summary}>
        <SummaryCard
          title="Total Classes"
          value={classes.length}
          icon="library"
          color="#4467EE"
          delay={100}
        />
        <SummaryCard
          title="Total Students"
          value={classes.reduce((sum, cls) => sum + cls.totalStudents, 0)}
          icon="people"
          color="#4CAF50"
          delay={200}
        />
        <SummaryCard
          title="Monthly Revenue"
          value={`₹${classes.reduce((sum, cls) => sum + (cls.monthlyFee * cls.totalStudents), 0)}`}
          icon="trending-up"
          color="#FF9800"
          delay={300}
        />
      </View>

      <ScrollView
        style={styles.classesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4467EE']}
            tintColor="#4467EE"
            progressViewOffset={20}
          />
        }
      >
        {loading ? (
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
              <Ionicons name="refresh" size={isTablet ? 32 : 24} color="#4467EE" />
            </Animated.View>
            <Text style={styles.loadingText}>Loading your classes...</Text>
          </View>
        ) : classes.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.classGrid}>
            {classes.map((classData, index) => (
              <AnimatedCard
                key={classData.id}
                classData={classData}
                index={index}
              />
            ))}
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
    padding: isTablet ? 24 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecef',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '800',
    color: '#333',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 14 : 12,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#4467EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: isTablet ? 16 : 15,
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: isTablet ? 24 : 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  summaryIconContainer: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  summaryNumber: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  classesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  classGrid: {
    gap: isTablet ? 24 : 16,
    paddingBottom: 24,
  },
  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  cardTouchable: {
    padding: isTablet ? 24 : 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cardContent: {
    marginBottom: 16,
  },
  className: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
    lineHeight: isTablet ? 30 : 26,
  },
  classDescription: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: isTablet ? 24 : 20,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statIconContainer: {
    width: isTablet ? 32 : 28,
    height: isTablet ? 32 : 28,
    borderRadius: isTablet ? 16 : 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  statNumber: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: isTablet ? 12 : 10,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: isTablet ? 24 : 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: 12,
    gap: 8,
    flex: 1,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#4467EE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    flex: 1,
  },
  actionButtonsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: isTablet ? 14 : 12,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#4467EE',
  },
  moreButton: {
    padding: isTablet ? 14 : 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#e8ecef',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: isTablet ? 18 : 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: isTablet ? 18 : 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    marginBottom: 24,
    fontWeight: '400',
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4467EE',
    paddingHorizontal: isTablet ? 28 : 20,
    paddingVertical: isTablet ? 16 : 14,
    borderRadius: 12,
    gap: 10,
    elevation: 4,
    shadowColor: '#4467EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
  },
});