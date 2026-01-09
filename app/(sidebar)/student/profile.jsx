import React, { useState } from "react";
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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const StudentProfilePage = () => {
  const [studentData, setStudentData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    rollNumber: "STD001",
    gender: "Male",
    profileImage: null,
    dateOfBirth: "2005-03-15",
    address: "123 Main Street, City, State - 123456",
    emergencyContact: "+91 9876543211",
    joinedClasses: [
      {
        id: 1,
        subject: "Mathematics",
        teacher: "Dr. Smith",
        joinDate: "2025-01-15",
      },
      {
        id: 2,
        subject: "Physics",
        teacher: "Prof. Johnson",
        joinDate: "2025-02-01",
      },
      {
        id: 3,
        subject: "Chemistry",
        teacher: "Dr. Brown",
        joinDate: "2025-02-15",
      },
    ],
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setStudentData((prev) => ({
        ...prev,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const openEditModal = () => {
    setEditData({ ...studentData });
    setEditModalVisible(true);
  };

  const saveProfile = () => {
    setStudentData(editData);
    setEditModalVisible(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () =>
          Alert.alert("Logged out", "You have been logged out successfully"),
      },
    ]);
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const ClassCard = ({ classData }) => (
    <View style={styles.classCard}>
      <Text style={styles.className}>{classData.subject}</Text>
      <Text style={styles.teacherName}>Teacher: {classData.teacher}</Text>
      <Text style={styles.joinDate}>
        Joined on: {new Date(classData.joinDate).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <TouchableOpacity onPress={openEditModal}>
          <Ionicons name="create-outline" size={24} color="#4467EE" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickProfileImage}>
          {studentData.profileImage ? (
            <Image
              source={{ uri: studentData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={50} color="#4467EE" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{studentData.name}</Text>
        <Text style={styles.profileEmail}>{studentData.email}</Text>
        <Text style={styles.profileRoll}>
          Roll No: {studentData.rollNumber}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <InfoRow label="Phone" value={studentData.phone} />
        <InfoRow label="Gender" value={studentData.gender} />
        <InfoRow label="DOB" value={studentData.dateOfBirth} />
        <InfoRow label="Address" value={studentData.address} />
        <InfoRow
          label="Emergency Contact"
          value={studentData.emergencyContact}
        />
      </View>

      <Text style={styles.sectionTitle}>Joined Classes</Text>
      {studentData.joinedClasses.map((cls) => (
        <ClassCard key={cls.id} classData={cls} />
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={editModalVisible} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editData.name}
            onChangeText={(text) => setEditData({ ...editData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={editData.email}
            onChangeText={(text) => setEditData({ ...editData, email: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={editData.phone}
            onChangeText={(text) => setEditData({ ...editData, phone: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            value={editData.address}
            onChangeText={(text) => setEditData({ ...editData, address: text })}
          />

          <View style={styles.switchContainer}>
            <Text>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(val) => setNotificationsEnabled(val)}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={(val) => setDarkModeEnabled(val)}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#4467EE" },
  profileCard: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: { fontSize: 20, fontWeight: "bold", marginTop: 8 },
  profileEmail: { fontSize: 14, color: "gray" },
  profileRoll: { fontSize: 14, color: "#4467EE", marginTop: 4 },
  infoSection: { marginBottom: 24 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: { fontWeight: "600", color: "#111" },
  infoValue: { color: "#333" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4467EE",
    marginBottom: 8,
  },
  classCard: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  className: { fontSize: 16, fontWeight: "bold", color: "#111" },
  teacherName: { fontSize: 14, color: "#555" },
  joinDate: { fontSize: 12, color: "#777" },
  logoutButton: { marginTop: 20, alignItems: "center" },
  logoutText: { color: "#EF4444", fontWeight: "bold" },
  modalContainer: { padding: 20, backgroundColor: "#fff" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4467EE",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#4467EE",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "white", fontWeight: "bold" },
});

export default StudentProfilePage;
