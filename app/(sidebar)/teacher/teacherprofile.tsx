import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TeacherProfile = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Ionicons name="person" size={40} color="#4467EE" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.teacherName}>Prof. John Smith</Text>
        <Text style={styles.teacherEmail}>john.smith@email.com</Text>
        <Text style={styles.teacherPhone}>+91 98765 43210</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="book" size={24} color="#4467EE" />
          </View>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Classes Created</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="people" size={24} color="#4467EE" />
          </View>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="cash" size={24} color="#4467EE" />
          </View>
          <Text style={styles.statNumber}>₹25,000</Text>
          <Text style={styles.statLabel}>Monthly Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="time" size={24} color="#4467EE" />
          </View>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Pending Approvals</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="person-outline" size={20} color="#4467EE" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>Prof. John Smith</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="mail-outline" size={20} color="#4467EE" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>john.smith@email.com</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="call-outline" size={20} color="#4467EE" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>+91 98765 43210</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="school-outline" size={20} color="#4467EE" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Specialization</Text>
            <Text style={styles.detailValue}>Mathematics & Physics</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#4467EE" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Member Since</Text>
            <Text style={styles.detailValue}>January 2024</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editProfileButton}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.changePasswordButton}>
          <Ionicons name="lock-closed-outline" size={20} color="#4467EE" />
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4467EE',
    paddingVertical: 70,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -30,
    borderRadius: 15,
    padding: 20,
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
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4467EE',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4467EE',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  teacherName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  teacherEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  teacherPhone: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionContainer: {
    margin: 20,
    gap: 15,
  },
  editProfileButton: {
    backgroundColor: '#4467EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4467EE',
    gap: 10,
  },
  changePasswordText: {
    color: '#4467EE',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TeacherProfile;