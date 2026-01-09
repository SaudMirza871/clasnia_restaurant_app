import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const StudentPaymentPage = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      classSubject: 'Mathematics',
      teacherName: 'Dr. Smith',
      monthlyFee: 2500,
      dueDate: '2025-06-15',
      status: 'pending',
      isUrgent: true,
      month: 'June 2025'
    },
    {
      id: 2,
      classSubject: 'Physics',
      teacherName: 'Prof. Johnson',
      monthlyFee: 3000,
      dueDate: '2025-06-20',
      status: 'pending',
      isUrgent: false,
      month: 'June 2025'
    },
    {
      id: 3,
      classSubject: 'Chemistry',
      teacherName: 'Dr. Brown',
      monthlyFee: 2800,
      dueDate: '2025-05-30',
      status: 'paid',
      month: 'May 2025',
      paidDate: '2025-05-28'
    }
  ]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');

  const urgentPayments = payments.filter(p => p.isUrgent && p.status === 'pending');
  const upcomingPayments = payments.filter(p => !p.isUrgent && p.status === 'pending');
  const completedPayments = payments.filter(p => p.status === 'paid');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPaymentScreenshot(result.assets[0].uri);
    }
  };

  const submitPayment = async () => {
    if (!paymentScreenshot) {
      Alert.alert('Error', 'Please upload payment screenshot');
      return;
    }

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      setPaymentModalVisible(false);
      setPaymentScreenshot(null);
      setPaymentNote('');
      
      // Update payment status to verification pending
      setPayments(prev => 
        prev.map(p => 
          p.id === selectedPayment.id 
            ? { ...p, status: 'verification_pending' }
            : p
        )
      );
      
      Alert.alert('Success', 'Payment screenshot uploaded successfully! Waiting for teacher verification.');
    }, 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const PaymentCard = ({ payment, isUrgent = false }) => {
    const daysLeft = getDaysUntilDue(payment.dueDate);
    
    return (
      <TouchableOpacity 
        style={[
          styles.paymentCard,
          isUrgent && styles.urgentCard,
          payment.status === 'paid' && styles.paidCard
        ]}
        onPress={() => {
          if (payment.status === 'pending') {
            setSelectedPayment(payment);
            setPaymentModalVisible(true);
          }
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>{payment.classSubject}</Text>
            <Text style={styles.teacherName}>{payment.teacherName}</Text>
          </View>
          <View style={styles.statusContainer}>
            {payment.status === 'paid' && (
              <View style={styles.paidBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.paidText}>Paid</Text>
              </View>
            )}
            {payment.status === 'verification_pending' && (
              <View style={styles.pendingBadge}>
                <MaterialIcons name="hourglass-top" size={18} color="#F59E0B" />
                <Text style={styles.pendingText}>Verifying</Text>
              </View>
            )}
            {isUrgent && payment.status === 'pending' && (
              <View style={styles.urgentBadge}>
                <MaterialIcons name="priority-high" size={18} color="#EF4444" />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.feeInfo}>
            <Text style={styles.feeAmount}>₹{payment.monthlyFee}</Text>
            <Text style={styles.monthText}>{payment.month}</Text>
          </View>
          
          {payment.status === 'paid' ? (
            <Text style={styles.paidDate}>
              Paid on {formatDate(payment.paidDate)}
            </Text>
          ) : (
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.dueDate}>
                Due: {formatDate(payment.dueDate)}
              </Text>
              {daysLeft <= 3 && (
                <Text style={styles.daysLeft}>
                  ({daysLeft} days left)
                </Text>
              )}
            </View>
          )}
        </View>

        {payment.status === 'pending' && (
          <View style={styles.cardFooter}>
            <Text style={styles.payNowText}>Tap to pay</Text>
            <AntDesign name="right" size={16} color="#4467EE" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payments</Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#4467EE" />
          </TouchableOpacity>
        </View>

        {/* Urgent Payments */}
        {urgentPayments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="priority-high" size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Urgent Payments</Text>
            </View>
            {urgentPayments.map(payment => (
              <PaymentCard key={payment.id} payment={payment} isUrgent={true} />
            ))}
          </View>
        )}

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={24} color="#4467EE" />
              <Text style={styles.sectionTitle}>Upcoming Payments</Text>
            </View>
            {upcomingPayments.map(payment => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </View>
        )}

        {/* Payment History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Payment History</Text>
          </View>
          {completedPayments.map(payment => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="stats-chart" size={24} color="#4467EE" />
            <Text style={styles.summaryTitle}>Monthly Summary</Text>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{payments.filter(p => p.status === 'paid').length}</Text>
              <Text style={styles.statLabel}>Paid</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{payments.filter(p => p.status === 'pending').length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ₹{payments.reduce((sum, p) => sum + p.monthlyFee, 0)}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make Payment</Text>
              <TouchableOpacity 
                onPress={() => setPaymentModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedPayment && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentSubject}>{selectedPayment.classSubject}</Text>
                  <Text style={styles.paymentTeacher}>{selectedPayment.teacherName}</Text>
                  <Text style={styles.paymentAmount}>₹{selectedPayment.monthlyFee}</Text>
                  <Text style={styles.paymentMonth}>{selectedPayment.month}</Text>
                </View>

                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>Pay using QR Code</Text>
                  <View style={styles.qrPlaceholder}>
                    <Ionicons name="qr-code" size={80} color="#4467EE" />
                    <Text style={styles.qrText}>QR Code will be shown here</Text>
                  </View>
                </View>

                <View style={styles.uploadSection}>
                  <Text style={styles.uploadTitle}>Upload Payment Screenshot</Text>
                  
                  {paymentScreenshot ? (
                    <View style={styles.imagePreview}>
                      <Image source={{ uri: paymentScreenshot }} style={styles.previewImage} />
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => setPaymentScreenshot(null)}
                      >
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                      <Ionicons name="camera" size={32} color="#4467EE" />
                      <Text style={styles.uploadText}>Select Image</Text>
                    </TouchableOpacity>
                  )}

                  <TextInput
                    style={styles.noteInput}
                    placeholder="Add a note (optional)"
                    value={paymentNote}
                    onChangeText={setPaymentNote}
                    multiline
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={submitPayment}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>Submit Payment</Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  urgentCard: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  paidCard: {
    borderColor: '#10B981',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  teacherName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 4,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 4,
  },
  cardBody: {
    marginBottom: 12,
  },
  feeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4467EE',
  },
  monthText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  daysLeft: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 4,
  },
  paidDate: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  payNowText: {
    fontSize: 14,
    color: '#4467EE',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4467EE',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  paymentDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentTeacher: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4467EE',
    marginTop: 8,
  },
  paymentMonth: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  qrSection: {
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  qrPlaceholder: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  qrText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 14,
    color: '#4467EE',
    marginTop: 8,
    fontWeight: '500',
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#4467EE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default StudentPaymentPage;