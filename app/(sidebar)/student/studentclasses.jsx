import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StudentMyClasses = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const classes = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Prof. John Smith',
      classCode: 'MATH001',
      monthlyFee: 2500,
      status: 'Active',
      joinedDate: 'Sept 2024',
      payments: [
        { month: 'December 2024', status: 'Paid', amount: 2500, paidDate: 'Dec 5, 2024' },
        { month: 'November 2024', status: 'Paid', amount: 2500, paidDate: 'Nov 3, 2024' },
        { month: 'October 2024', status: 'Paid', amount: 2500, paidDate: 'Oct 8, 2024' },
        { month: 'September 2024', status: 'Paid', amount: 2500, paidDate: 'Sep 12, 2024' },
      ]
    },
    {
      id: 2,
      subject: 'Physics',
      teacher: 'Prof. Sarah Wilson',
      classCode: 'PHY001',
      monthlyFee: 3000,
      status: 'Active',
      joinedDate: 'Oct 2024',
      payments: [
        { month: 'December 2024', status: 'Unpaid', amount: 3000, dueDate: 'Dec 31, 2024' },
        { month: 'November 2024', status: 'Paid', amount: 3000, paidDate: 'Nov 10, 2024' },
        { month: 'October 2024', status: 'Paid', amount: 3000, paidDate: 'Oct 15, 2024' },
      ]
    },
    {
      id: 3,
      subject: 'Chemistry',
      teacher: 'Prof. Mike Johnson',
      classCode: 'CHEM001',
      monthlyFee: 2800,
      status: 'Active',
      joinedDate: 'Nov 2024',
      payments: [
        { month: 'December 2024', status: 'Pending', amount: 2800, uploadDate: 'Dec 20, 2024' },
        { month: 'November 2024', status: 'Paid', amount: 2800, paidDate: 'Nov 25, 2024' },
      ]
    },
  ];

  const filteredClasses = classes.filter(cls => 
    cls.subject.toLowerCase().includes(searchText.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderPaymentStatus = (status) => {
    const statusStyles = {
      'Paid': { backgroundColor: '#e8f5e8', color: '#4CAF50', borderColor: '#4CAF50' },
      'Unpaid': { backgroundColor: '#ffebee', color: '#ff5252', borderColor: '#ff5252' },
      'Pending': { backgroundColor: '#fff3e0', color: '#ff9800', borderColor: '#ff9800' },
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: statusStyles[status].backgroundColor, borderColor: statusStyles[status].borderColor }]}>
        <Text style={[styles.statusText, { color: statusStyles[status].color }]}>{status}</Text>
      </View>
    );
  };

  const handlePaymentUpload = (classItem, month) => {
    setSelectedClass(classItem);
    setSelectedMonth(month);
    setShowPaymentModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>{classes.length} Classes Joined</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search classes or teachers..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Classes List */}
      <ScrollView style={styles.content}>
        {filteredClasses.map((classItem) => (
          <View key={classItem.id} style={styles.classCard}>
            <View style={styles.classHeader}>
              <View style={styles.classInfo}>
                <Text style={styles.subjectName}>{classItem.subject}</Text>
                <Text style={styles.teacherName}>{classItem.teacher}</Text>
                <Text style={styles.classCode}>Class Code: {classItem.classCode}</Text>
              </View>
              <View style={styles.classStats}>
                <Text style={styles.monthlyFee}>₹{classItem.monthlyFee}/month</Text>
                <Text style={styles.joinedDate}>Joined: {classItem.joinedDate}</Text>
              </View>
            </View>

            {/* Payment History */}
            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>Payment History</Text>
              {classItem.payments.map((payment, index) => (
                <View key={index} style={styles.paymentRow}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentMonth}>{payment.month}</Text>
                    <Text style={styles.paymentAmount}>₹{payment.amount}</Text>
                    {payment.paidDate && (
                      <Text style={styles.paymentDate}>Paid on {payment.paidDate}</Text>
                    )}
                    {payment.dueDate && (
                      <Text style={styles.dueDate}>Due: {payment.dueDate}</Text>
                    )}
                    {payment.uploadDate && (
                      <Text style={styles.uploadDate}>Uploaded: {payment.uploadDate}</Text>
                    )}
                  </View>
                  <View style={styles.paymentActions}>
                    {renderPaymentStatus(payment.status)}
                    {payment.status === 'Unpaid' && (
                      <TouchableOpacity 
                        style={styles.uploadButton}
                        onPress={() => handlePaymentUpload(classItem, payment)}
                      >
                        <Ionicons name="cloud-upload" size={16} color="#4467EE" />
                        <Text style={styles.uploadText}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="receipt-outline" size={16} color="#4467EE" />
                <Text style={styles.actionText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#4467EE" />
                <Text style={styles.actionText}>Contact Teacher</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Payment Upload Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Payment Screenshot</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedClass && selectedMonth && (
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentSubject}>{selectedClass.subject}</Text>
                <Text style={styles.paymentMonth}>{selectedMonth.month}</Text>
                <Text style={styles.paymentAmount}>Amount: ₹{selectedMonth.amount}</Text>
              </View>
            )}

            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadArea}>
                <Ionicons name="cloud-upload" size={48} color="#4467EE" />
                <Text style={styles.uploadTitle}>Upload Screenshot</Text>
                <Text style={styles.uploadSubtitle}>Tap to select payment screenshot</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Upload Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  classInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  classCode: {
    fontSize: 14,
    color: '#999',
  },
  classStats: {
    alignItems: 'flex-end',
  },
  monthlyFee: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4467EE',
    marginBottom: 5,
  },
  joinedDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  paymentAmount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#4CAF50',
  },
  dueDate: {
    fontSize: 12,
    color: '#ff5252',
  },
  uploadDate: {
    fontSize: 12,
    color: '#ff9800',
  },
  paymentActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4467EE',
  },
  uploadText: {
    color: '#4467EE',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4467EE',
  },
  actionText: {
    color: '#4467EE',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentDetails: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  paymentSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  uploadSection: {
    marginBottom: 30,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#4467EE',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4467EE',
    marginTop: 10,
    marginBottom: 5,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  }
  });

  export default StudentMyClasses;
