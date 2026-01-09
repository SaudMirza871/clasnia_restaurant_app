import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';



const { width } = Dimensions.get("window");

export default function TeacherDashboard() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // Sample data - Replace with actual data from Firebase
  const [dashboardData, setDashboardData] = useState({
    teacherName: "Sagar Sir",
    totalStudents: 24,
    dueFees: 9,
    collectedAmount: 15000,
    totalAmount: 24000,
    dueStudentsCount: 9,
  });

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const calculateProgressPercentage = () => {
    return (dashboardData.collectedAmount / dashboardData.totalAmount) * 100;
  };

  const StatCard = ({ title, value, color, icon, delay = 0 }) => {
    const [cardAnim] = useState(new Animated.Value(0));

    useEffect(() => {
      setTimeout(() => {
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: false,
        }).start();
      }, delay);
    }, []);

    return (
      <Animated.View
        style={[
          styles.statCard,
          {
            transform: [
              {
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: cardAnim,
          },
        ]}
      >
        <View style={styles.statHeader}>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
      </Animated.View>
    );
  };

  const QuickActionButton = ({ icon, title, onPress, delay = 0 }) => {
    const [buttonAnim] = useState(new Animated.Value(0));
    const [pressAnim] = useState(new Animated.Value(1));
     
    

    useEffect(() => {
      setTimeout(() => {
        Animated.spring(buttonAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: false,
        }).start();
      }, delay);
    }, []);

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.95,
        useNativeDriver: false,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    };
     

    return (
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              { scale: pressAnim },
            ],
            opacity: buttonAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name={icon} size={24} color="#4467EE" />
          </View>
          <Text style={styles.quickActionText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  //  useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => {
  //     if (token) setExpoPushToken(token);
  //   });
  // }, []);

  // const handleSend = async () => {
  //   console.log('Sending notification...',expoPushToken);
  //   // if (!expoPushToken) {
  //   //   Alert.alert('No push token yet');
  //   //   return;
  //   // } 
  //   console.log('Sending notification to:', expoPushToken);
    
  //   await sendPushNotification(expoPushToken);
  //   Alert.alert('Notification sent!');
  // };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["#4467EE", "#6366F1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.teacherName}>
                {dashboardData.teacherName}
              </Text>
            </View>
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitial}>S</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Students"
          value={dashboardData.totalStudents}
          color="#1F2937"
          delay={200}
        />
        <StatCard
          title="Due Fees"
          value={dashboardData.dueFees}
          color="#EF4444"
          delay={300}
        />
      </View>

      {/* Fee Collection Section */}
      {/* <Animated.View
        style={[
          styles.feeCollectionCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.feeCollectionHeader}>
          <Text style={styles.feeCollectionTitle}>Fee Collection</Text>
          <Text style={styles.feeCollectionSubtitle}>This Month</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", `${calculateProgressPercentage()}%`],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.amountContainer}>
          <View style={styles.amountItem}>
            <Text style={styles.collectedAmount}>
              ₹{dashboardData.collectedAmount.toLocaleString()} collected
            </Text>
          </View>
          <View style={styles.amountItem}>
            <Text style={styles.totalAmount}>
              ₹{dashboardData.totalAmount.toLocaleString()} total
            </Text>
          </View>
        </View>
      </Animated.View> */}

      {/* Notification Section */}
      <Animated.View
        style={[
          styles.notificationCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color="#EF4444" />
          </View>
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>Notify Due Students</Text>
            <Text style={styles.notificationSubtitle}>
              Send reminder to {dashboardData.dueStudentsCount} students
            </Text>
          </View>
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="person-add-outline"
            title="Create Class"
            onPress={() =>{const router = useRouter();
              router.push("(sidebar)/teacher/createclass")
            } }
            delay={400}
          />
          {/* <QuickActionButton
            icon="qr-code-outline"
            title="Show QR"
            onPress={() => console.log("Show QR")}
            delay={500}
          /> */}
          <QuickActionButton
            icon="checkmark-circle-outline"
            title="Verify Payments"
            onPress={() => {
              const router = useRouter();
              router.push("(sidebar)/teacher/approval");
            }}
            delay={600}
          />
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 4,
  },
  teacherName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    marginBottom: 8,
  },
  statTitle: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  feeCollectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feeCollectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  feeCollectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  feeCollectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountItem: {
    flex: 1,
  },
  collectedAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "right",
  },
  notificationCard: {
    backgroundColor: "#FEF2F2",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  sendButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 20,
  },
});
