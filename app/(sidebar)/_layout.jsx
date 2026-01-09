import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View, Text, StyleSheet,Button  } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect
} from "react";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import useUserInfo from "../../hooks/useUserInfo";


// type UserType = "tuition" | "student" | null;

// interface SidebarItem {
//   name: string;
//   route: string;
//   icon: string;
//   iconFamily: "ionicons" | "material" | "fontawesome";
// }

const teacherSidebarItems = [
  {
    name: "Dashboard",
    route: "teacher/dashboard",
    icon: "grid-outline",
    iconFamily: "ionicons",
  },
  {
    name: "My Classes",
    route: "teacher/myclasses",
    icon: "school-outline",
    iconFamily: "ionicons",
  },
  {
    name: "Create Class",
    route: "teacher/createclass",
    icon: "add-circle-outline",
    iconFamily: "ionicons",
  },
  // {
  //   name: "Students",
  //   route: "teacher/students",
  //   icon: "people-outline",
  //   iconFamily: "ionicons",
  // },
  {
    name: "Approvals",
    route: "teacher/approval",
    icon: "checkmark-circle-outline",
    iconFamily: "ionicons",
  },
  // {
  //   name: "Earnings",
  //   route: "teacher/earnings",
  //   icon: "cash-outline",
  //   iconFamily: "ionicons",
  // },
  {
    name: "Profile",
    route: "teacher/teacherprofile",
    icon: "person-outline",
    iconFamily: "ionicons",
  },
];

const studentSidebarItems= [
  {
    name: "Dashboard",
    route: "student/dashboard",
    icon: "grid-outline",
    iconFamily: "ionicons",
  },
  {
    name: "My Classes",
    route: "student/myclasses",
    icon: "book-outline",
    iconFamily: "ionicons",
  },
  {
    name: "Join Class",
    route: "student/joinclass",
    icon: "enter-outline",
    iconFamily: "ionicons",
  },
  {
    name: "Payments",
    route: "student/payment",
    icon: "card-outline",
    iconFamily: "ionicons",
  },
  {
    name: "Profile",
    route: "student/profile",
    icon: "person-outline",
    iconFamily: "ionicons",
  },
];

function CustomDrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, loading, error, refetch } = useUserInfo();

  useEffect(() => {
    if (!loading && userInfo == null) {
      router.replace("/auth/signin");
    }
  }, [userInfo, loading]);

  console.log("CustomDrawerContent render:", { userInfo, loading, error });

  const sidebarItems = userInfo?.role === "Tuition Teacher" ? teacherSidebarItems : studentSidebarItems;

  const renderIcon = (item, focused) => {
    const color = focused ? "#FFFFFF" : "#666666";
    const size = 24;

    switch (item.iconFamily) {
      case "ionicons":
        return <Ionicons name={item.icon } size={size} color={color} />;
      case "material":
        return <MaterialIcons name={item.icon } size={size} color={color} />;
      case "fontawesome":
        return <FontAwesome5 name={item.icon } size={size} color={color} />;
      default:
        return <Ionicons name="circle-outline" size={size} color={color} />;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userData");
      router.replace("/auth/signin");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.profileSection}>
        {loading ? (
          <Text>Loading user info...</Text>
        ) : error ? (
          <View>
            <Text style={styles.errorText}>Error: {error}</Text>
            <Button title="Retry" onPress={refetch} />
          </View>
        ) : userInfo ? (
          <>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{userInfo.avatar}</Text>
            </View>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userRole}>{userInfo.role}</Text>
          </>
        ) : (
          <Text>No user data available</Text>
        )}
      </View>

      <DrawerContentScrollView
        {...props}
        style={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navSection}>
          {sidebarItems.map((item, index) => {
            const isActive = pathname.includes(item.route);

            return (
              <View key={index} style={styles.drawerItemWrapper}>
                <DrawerItem
                  label={item.name}
                  focused={isActive}
                  onPress={() => router.push(item.route )}
                  icon={({ focused }) => (
                    <View style={styles.iconContainer}>
                      {renderIcon(item, isActive)}
                    </View>
                  )}
                  labelStyle={[
                    styles.drawerLabel,
                    { color: isActive ? "#FFFFFF" : "#333333" },
                  ]}
                  style={[
                    styles.drawerItem,
                    isActive && styles.drawerItemActive,
                  ]}
                  pressColor="rgba(68, 103, 238, 0.1)"
                  pressOpacity={0.8}
                />
              </View>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <View style={styles.drawerItemWrapper}>
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={() => (
              <View style={styles.iconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
              </View>
            )}
            labelStyle={[styles.drawerLabel, { color: "#FF6B6B" }]}
            style={styles.drawerItem}
            pressColor="rgba(255, 107, 107, 0.1)"
            pressOpacity={0.8}
          />
        </View>
      </View>
    </View>
  );
}

// Keep you

export default function Layout() {
  
  // const [userType, setUserType] = useState("tuition");



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4467EE",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          drawerStyle: {
            backgroundColor: "#FFFFFF",
            width: 300,
          },
          drawerActiveTintColor: "#FFFFFF",
          drawerInactiveTintColor: "#333333",
          drawerActiveBackgroundColor: "#4467EE",
          drawerInactiveBackgroundColor: "transparent",
        }}
      >
        <Drawer.Screen
          name="teacher/dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Teacher Dashboard",
          }}
        />
        <Drawer.Screen
          name="teacher/myclasses"
          options={{
            drawerLabel: "My Classes",
            title: "My Classes",
          }}
        />
        <Drawer.Screen
          name="teacher/createclass"
          options={{
            drawerLabel: "Create Class",
            title: "Create New Class",
          }}
        />
        {/* <Drawer.Screen
          name="teacher/students"
          options={{
            drawerLabel: "Students",
            title: "All Students",
          }}
        /> */}
        <Drawer.Screen
          name="teacher/approval"
          options={{
            drawerLabel: "Approvals",
            title: "Pending Approvals",
          }}
        />
        {/* <Drawer.Screen
          name="teacher/earnings"
          options={{
            drawerLabel: "Earnings",
            title: "Monthly Earnings",
          }}
        /> */}
        <Drawer.Screen
          name="teacher/teacherprofile"
          options={{
            drawerLabel: "Profile",
            title: "Teacher Profile",
          }}
        />

        {/* Student Screens */}
        <Drawer.Screen
          name="student/dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Student Dashboard",
          }}
        />
        <Drawer.Screen
          name="student/myclasses"
          options={{
            drawerLabel: "My Classes",
            title: "My Classes",
          }}
        />
        <Drawer.Screen
          name="student/joinclass"
          options={{
            drawerLabel: "Join Class",
            title: "Join New Class",
          }}
        />
        <Drawer.Screen
          name="student/payment"
          options={{
            drawerLabel: "Payments",
            title: "Payment Tracker",
          }}
        />
        <Drawer.Screen
          name="student/profile"
          options={{
            drawerLabel: "Profile",
            title: "Student Profile",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  profileSection: {
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4467EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4467EE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    fontSize: 36,
  },
  userName: {
    color: "#1F2937",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  userRole: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  drawerContent: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "#FFFFFF",
  },
  navSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  drawerItemWrapper: {
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  drawerItem: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 0,
    marginVertical: 0,
    height: 56,
    justifyContent: "center",
  },
  drawerItemActive: {
    backgroundColor: "#4467EE",
    shadowColor: "#4467EE",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 0,
    flex: 1,
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
  },
});
