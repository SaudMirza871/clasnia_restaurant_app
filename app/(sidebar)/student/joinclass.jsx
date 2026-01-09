import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../../../config/firebaseConfig";
import { uploadToCloudinary } from "../../../hooks/uploadToCloudinary";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const JoinClassPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [joinForm, setJoinForm] = useState({
    name: "",
    phone: "",
    rollNumber: "",
    gender: "",
    transactionId: "",
    screenshot: null,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      if (!auth.currentUser) {
        Alert.alert("Error", "Please log in to view classes.");
        setLoading(false);
        return;
      }

      try {
        console.log("User authenticated:", auth.currentUser.uid);
        const token = await auth.currentUser.getIdToken(true); // Force token refresh
        console.log("Auth token:", token ? "Valid" : "Missing");
        console.log("Fetching classes from Firestore...");
        const classesSnapshot = await getDocs(collection(db, "classes"));
        console.log("Classes snapshot size:", classesSnapshot.size);
        const classesData = await Promise.all(
          classesSnapshot.docs.map(async (classDoc) => {
            const data = classDoc.data();
            let teacherName = "Unknown";
            if (data.teacherId) {
              const teacherRef = doc(db, "users", data.teacherId);
              const teacherDoc = await getDoc(teacherRef);
              if (teacherDoc.exists()) {
                teacherName = teacherDoc.data().name || "Unknown";
              }
            }
            return {
              id: classDoc.id,
              classId: data.classId,
              classCode: data.classCode,
              subject: data.subject,
              className: data.className,
              monthlyFee: data.monthlyFee,
              teacherId: data.teacherId,
              teacherName,
              qrCodeUrl: data.qrCodeUrl,
            };
          })
        );
        console.log("Classes fetched:", classesData.length);
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes:", error.code, error.message);
        Alert.alert("Error", `Failed to load classes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your photos.");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setJoinForm({ ...joinForm, screenshot: result.assets[0] });
    }
  };

  // const uploadScreenshot = async (uri, userId, classId) => {
  //   try {
  //     const response = await fetch(uri);
  //     const blob = await response.blob();
  //     const storage = getStorage();
  //     const fileName = `${Date.now()}.jpg`;
  //     const storageRef = ref(
  //       storage,
  //       `payment_screenshots/${userId}/${fileName}`
  //     );
  //     await uploadBytes(storageRef, blob);
  //     const downloadURL = await getDownloadURL(storageRef);
  //     return downloadURL;
  //   } catch (error) {
  //     console.error("Screenshot upload error:", error);
  //     throw new Error("Failed to upload payment screenshot");
  //   }
  // };

  const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const handleJoinClass = (classData) => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please log in to join a class.");
      return;
    }
    setSelectedClass(classData);
    setJoinModalVisible(true);
  };

  const handleFormSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please log in to submit a join request.");
      return;
    }

    if (
      !joinForm.name ||
      !joinForm.phone ||
      !joinForm.rollNumber ||
      !joinForm.gender ||
      !joinForm.transactionId ||
      !joinForm.screenshot
    ) {
      Alert.alert(
        "Error",
        "Please fill all required fields and upload a payment screenshot."
      );
      return;
    }

    if (!/^\d{10}$/.test(joinForm.phone)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return;
    }

    setSubmitLoading(true);

    try {
      const screenshotUrl = await retry(() =>
        // uploadScreenshot(joinForm.screenshot.uri, auth.currentUser.uid, selectedClass.classId)
        uploadToCloudinary(joinForm.screenshot.uri)
      );

      const joinRequestData = {
        classId: doc(db, "classes", selectedClass.classId),
        gender:
          joinForm.gender.charAt(0).toUpperCase() + joinForm.gender.slice(1),
        phone: parseInt(joinForm.phone, 10),
        requestedAt: serverTimestamp(),
        rollNumber: joinForm.rollNumber,
        status: "pending",
        studentId: doc(db, "users", auth.currentUser.uid),
        studentName: joinForm.name,
      };

      console.log("Submitting join request:", joinRequestData);
      await retry(() =>
        addDoc(collection(db, "join_requests"), joinRequestData)
      );

      const feeRecordData = {
        classId: doc(db, "classes", selectedClass.classId),
        studentId: doc(db, "users", auth.currentUser.uid),
        transactionId: joinForm.transactionId,
        screenshotUrl,
        createdAt: serverTimestamp(),
      };

      console.log("Submitting fee record:", feeRecordData);
      await retry(() => addDoc(collection(db, "fee_records"), feeRecordData));

      Alert.alert(
        "Success",
        "Join request submitted successfully! You will be notified once the teacher approves your request.",
        [
          {
            text: "OK",
            onPress: () => {
              setJoinModalVisible(false);
              setJoinForm({
                name: "",
                phone: "",
                rollNumber: "",
                gender: "",
                transactionId: "",
                screenshot: null,
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        "Error submitting join request:",
        error.code,
        error.message
      );
      Alert.alert("Error", `Failed to submit join request: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.classCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderClassCard = ({ item }) => (
    <View style={styles.classCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.subjectText}>{item.className}</Text>
          <Text style={styles.classIdText}>Code: {item.classCode}</Text>
        </View>
        <View style={styles.feeContainer}>
          <Text style={styles.feeText}>₹{item.monthlyFee}</Text>
          <Text style={styles.feeLabel}>per month</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.infoText}>{item.teacherName}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="book" size={16} color="#666" />
          <Text style={styles.infoText}>{item.subject}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => handleJoinClass(item)}
      >
        <Ionicons name="add-circle-outline" size={16} color="white" />
        <Text style={styles.joinButtonText}>Join Class</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Classes</Text>
        <Text style={styles.headerSubtitle}>
          Find and join classes that interest you
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes, subjects, teachers, or code..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4467EE" />
          <Text style={styles.loadingText}>Loading classes...</Text>
        </View>
      ) : classes.length === 0 ? (
        <Text style={styles.noClassesText}>No classes available.</Text>
      ) : (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={joinModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Join {selectedClass?.className}
              </Text>
              <TouchableOpacity
                onPress={() => setJoinModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.classInfo}>
                <Text style={styles.classInfoText}>
                  Teacher: {selectedClass?.teacherName}
                </Text>
                <Text style={styles.classInfoText}>
                  Subject: {selectedClass?.subject}
                </Text>
                <Text style={styles.classInfoText}>
                  Monthly Fee: ₹{selectedClass?.monthlyFee}
                </Text>
                <Text style={styles.classInfoText}>
                  Class Code: {selectedClass?.classCode}
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={joinForm.name}
                  onChangeText={(text) =>
                    setJoinForm({ ...joinForm, name: text })
                  }
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={joinForm.phone}
                  onChangeText={(text) =>
                    setJoinForm({ ...joinForm, phone: text })
                  }
                  placeholder="Enter your 10-digit phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Roll Number *</Text>
                <TextInput
                  style={styles.input}
                  value={joinForm.rollNumber}
                  onChangeText={(text) =>
                    setJoinForm({ ...joinForm, rollNumber: text })
                  }
                  placeholder="Enter your roll number"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.genderContainer}>
                  {["Male", "Female", "Other"].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        joinForm.gender.toLowerCase() ===
                          gender.toLowerCase() && styles.selectedGender,
                      ]}
                      onPress={() =>
                        setJoinForm({
                          ...joinForm,
                          gender: gender.toLowerCase(),
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.genderText,
                          joinForm.gender.toLowerCase() ===
                            gender.toLowerCase() && styles.selectedGenderText,
                        ]}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Transaction ID *</Text>
                <TextInput
                  style={styles.input}
                  value={joinForm.transactionId}
                  onChangeText={(text) =>
                    setJoinForm({ ...joinForm, transactionId: text })
                  }
                  placeholder="Enter payment transaction ID"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.container}>
                <Image
                  source={{ uri: selectedClass?.qrCodeUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Payment Screenshot *</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  <MaterialIcons
                    name="cloud-upload"
                    size={24}
                    color="#4467EE"
                  />
                  <Text style={styles.uploadText}>
                    {joinForm.screenshot
                      ? "Screenshot Uploaded"
                      : "Upload Payment Screenshot"}
                  </Text>
                </TouchableOpacity>
                {joinForm.screenshot && (
                  <Image
                    source={{ uri: joinForm.screenshot.uri }}
                    style={styles.previewImage}
                  />
                )}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, submitLoading && { opacity: 0.6 }]}
                onPress={handleFormSubmit}
                disabled={submitLoading}
              >
                <Text style={styles.submitButtonText}>
                  {submitLoading ? "Submitting..." : "Submit Join Request"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    margin: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4467EE",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  subjectText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  classIdText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "monospace",
  },
  feeContainer: {
    alignItems: "flex-end",
  },
  feeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4467EE",
  },
  feeLabel: {
    fontSize: 12,
    color: "#666",
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#666",
  },
  joinButton: {
    backgroundColor: "#4467EE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  classInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  classInfoText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  selectedGender: {
    backgroundColor: "#4467EE",
    borderColor: "#4467EE",
  },
  genderText: {
    fontSize: 15,
    color: "#666",
  },
  selectedGenderText: {
    color: "white",
    fontWeight: "600",
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "#4467EE",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 15,
    color: "#4467EE",
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#4467EE",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noClassesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default JoinClassPage;
