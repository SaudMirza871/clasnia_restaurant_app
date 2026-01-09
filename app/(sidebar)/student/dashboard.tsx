import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const router = useRouter();

const StudentDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.studentName}>Pravin</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="book-outline" size={28} color="#4467EE" />
          </View>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Joined Classes</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#4467EE" />
          </View>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Fees Paid</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="time-outline" size={28} color="#ff6b6b" />
          </View>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => {
            router.push('/(sidebar)/student/joinclass');  
          } }
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="add-circle" size={32} color="#4467EE" />
            </View>
            <Text style={styles.actionText}>Join New Class</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => {
            router.push('/(sidebar)/student/joinclass');  
          } }>
            <View style={styles.actionIconContainer}>
              <Ionicons name="card" size={32} color="#4467EE" />
            </View>
            <Text style={styles.actionText}>Upload Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => {
            router.push('/(sidebar)/student/joinclass');  
          } }
          
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="list" size={32} color="#4467EE" />
            </View>
            <Text style={styles.actionText}>My Classes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="receipt" size={32} color="#4467EE" />
            </View>
            <Text style={styles.actionText}>Fee History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Payment Verified</Text>
            <Text style={styles.activityDescription}>Mathematics - December 2024</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="cloud-upload" size={20} color="#2196F3" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Payment Screenshot Uploaded</Text>
            <Text style={styles.activityDescription}>Physics - December 2024</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="person-add" size={20} color="#FF9800" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Joined New Class</Text>
            <Text style={styles.activityDescription}>Chemistry with Prof. Smith</Text>
            <Text style={styles.activityTime}>3 days ago</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Fees */}
      <View style={styles.feesContainer}>
        <Text style={styles.sectionTitle}>Upcoming Fees</Text>
        
        <View style={styles.feeCard}>
          <View style={styles.feeInfo}>
            <Text style={styles.feeSubject}>Mathematics</Text>
            <Text style={styles.feeTeacher}>Prof. John Smith</Text>
            <Text style={styles.feeAmount}>₹2,500</Text>
          </View>
          <View style={styles.feeDue}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDate}>Jan 15, 2025</Text>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Due Soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.feeCard}>
          <View style={styles.feeInfo}>
            <Text style={styles.feeSubject}>Physics</Text>
            <Text style={styles.feeTeacher}>Prof. Sarah Wilson</Text>
            <Text style={styles.feeAmount}>₹3,000</Text>
          </View>
          <View style={styles.feeDue}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDate}>Jan 20, 2025</Text>
            <View style={styles.normalBadge}>
              <Text style={styles.normalText}>Upcoming</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4467EE',
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  studentName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIconContainer: {
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  activityContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  activityCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  feesContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  feeCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feeInfo: {
    flex: 1,
  },
  feeSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  feeTeacher: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4467EE',
  },
  feeDue: {
    alignItems: 'flex-end',
  },
  dueDateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  urgentBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  urgentText: {
    color: '#ff5252',
    fontSize: 12,
    fontWeight: 'bold',
  },
  normalBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  normalText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StudentDashboard;