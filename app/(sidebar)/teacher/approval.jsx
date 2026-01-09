import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../../config/firebaseConfig'; // Adjust path to your Firebase config
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

export default function TeacherApprovalsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch classes where teacherId matches current user's UID
  useEffect(() => {
    const fetchClasses = async () => {
      if (!auth.currentUser) {
        Alert.alert('Error', 'Please log in to view your classes.');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'classes'),
          where('teacherId', '==', auth.currentUser.uid)
        );
        const classesSnapshot = await getDocs(q);
        const classesData = classesSnapshot.docs.map((doc) => ({
          id: doc.id,
          className: doc.data().className,
          classCode: doc.data().classCode,
          subject: doc.data().subject,
          monthlyFee: doc.data().monthlyFee,
          teacherId: doc.data().teacherId,
          qrCodeUrl: doc.data().qrCodeUrl,
        }));
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching classes:', error);
        Alert.alert('Error', `Failed to load classes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch join requests for a selected class
  const fetchJoinRequests = async (classId) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'join_requests'),
        where('classId', '==', doc(db, 'classes', classId))
      );
      const requestsSnapshot = await getDocs(q);
      const requestsData = await Promise.all(
        requestsSnapshot.docs.map(async (requestDoc) => {
          const data = requestDoc.data();
          // Fetch student name from users collection if needed
          let studentName = data.studentName || 'Unknown';
          if (data.studentId) {
            const studentRef = data.studentId;
            const studentDoc = await getDoc(studentRef);
            if (studentDoc.exists()) {
              studentName = studentDoc.data().name || studentName;
            }
          }
          return {
            id: requestDoc.id,
            studentName,
            className: classes.find((cls) => cls.id === classId)?.className || 'Unknown',
            phone: data.phone,
            rollNumber: data.rollNumber,
            gender: data.gender,
            screenshotUrl: data.screenshotUrl,
            transactionId: data.transactionId,
            requestDate: data.requestedAt?.toDate().toISOString() || new Date().toISOString(),
            status: data.status,
          };
        })
      );
      setJoinRequests(requestsData);
      setSelectedClass(classes.find((cls) => cls.id === classId));
    } catch (error) {
      console.error('Error fetching join requests:', error);
      Alert.alert('Error', `Failed to load join requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewScreenshot = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const handleApprove = (requestId, studentName) => {
    Alert.alert(
      'Approve Request',
      `Are you sure you want to approve ${studentName}'s request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              const requestRef = doc(db, 'join_requests', requestId);
              await updateDoc(requestRef, { status: 'approved' });
              setJoinRequests((prev) =>
                prev.map((req) =>
                  req.id === requestId ? { ...req, status: 'approved' } : req
                )
              );
              Alert.alert('Success', `${studentName} has been approved successfully!`);
            } catch (error) {
              console.error('Error approving request:', error);
              Alert.alert('Error', `Failed to approve request: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleReject = (requestId, studentName) => {
    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject ${studentName}'s request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const requestRef = doc(db, 'join_requests', requestId);
              await updateDoc(requestRef, { status: 'rejected' });
              setJoinRequests((prev) =>
                prev.filter((req) => req.id !== requestId)
              );
              Alert.alert('Rejected', `${studentName}'s request has been rejected.`);
            } catch (error) {
              console.error('Error rejecting request:', error);
              Alert.alert('Error', `Failed to reject request: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleClassSelect = (classId) => {
    fetchJoinRequests(classId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedClass ? `Join Requests` : 'My Classes'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {selectedClass
            ? `${joinRequests.length} pending approval${joinRequests.length !== 1 ? 's' : ''}`
            : `${classes.length} class${classes.length !== 1 ? 'es' : ''}`}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#4467EE" />
            <Text style={styles.emptySubtitle}>Loading...</Text>
          </View>
        ) : !selectedClass ? (
          classes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="school-outline" size={80} color="#4467EE" />
              <Text style={styles.emptyTitle}>No Classes Found</Text>
              <Text style={styles.emptySubtitle}>
                You have not created any classes yet.
              </Text>
            </View>
          ) : (
            classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={styles.classCard}
                onPress={() => handleClassSelect(cls.id)}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.studentName}>{cls.className}</Text>
                    <Text style={styles.className}>Code: {cls.classCode}</Text>
                  </View>
                  <View style={styles.feeContainer}>
                    <Text style={styles.feeText}>₹{cls.monthlyFee}</Text>
                    <Text style={styles.feeLabel}>per month</Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Subject:</Text>
                    <Text style={styles.detailValue}>{cls.subject}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : joinRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={80} color="#4467EE" />
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySubtitle}>
              No join requests for {selectedClass.className}.
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedClass(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#4467EE" />
              <Text style={styles.backButtonText}>Back to Classes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setSelectedClass(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#4467EE" />
              <Text style={styles.backButtonText}>Back to Classes</Text>
            </TouchableOpacity>
            {joinRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{request.studentName}</Text>
                    <Text style={styles.className}>{request.className}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{request.status.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{request.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Roll Number:</Text>
                    <Text style={styles.detailValue}>{request.rollNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gender:</Text>
                    <Text style={styles.detailValue}>{request.gender}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID:</Text>
                    <Text style={styles.detailValue}>{request.transactionId}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Request Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    onPress={() => handleViewScreenshot(request.screenshotUrl)}
                    style={styles.screenshotButton}
                  >
                    <Ionicons name="image-outline" size={20} color="white" />
                    <Text style={styles.screenshotButtonText}>View Screenshot</Text>
                  </TouchableOpacity>
                  {request.status === 'pending' && (
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        onPress={() => handleReject(request.id, request.studentName)}
                        style={[styles.actionButton, styles.rejectButton]}
                      >
                        <Ionicons name="close-circle-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleApprove(request.id, request.studentName)}
                        style={[styles.actionButton, styles.approveButton]}
                      >
                        <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Screenshot</Text>
              <TouchableOpacity
                onPress={() => setImageModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  classCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4467EE',
  },
  requestCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4467EE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  className: {
    fontSize: 16,
    color: '#4467EE',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#4467EE20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#4467EE',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  screenshotButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#dc2626',
  },
  approveButton: {
    backgroundColor: '#4467EE',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalCloseButton: {
    padding: 8,
    backgroundColor: '#444',
    borderRadius: 20,
  },
  modalImage: {
    width: 280,
    height: 400,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#4467EE',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  feeContainer: {
    alignItems: 'flex-end',
  },
  feeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4467EE',
  },
  feeLabel: {
    fontSize: 12,
    color: '#888',
  },
  cardBody: {
    marginBottom: 15,
  },
});