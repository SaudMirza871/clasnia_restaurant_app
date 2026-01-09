// TeacherEarningsPage.js - Expo React Native Component
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TeacherEarningsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // Mock earnings data - this would come from Firebase
  const earningsData = [
    {
      id: '1',
      studentName: 'John Doe',
      className: 'Mathematics Grade 10',
      amount: 2500,
      date: '2024-01-15',
      month: '2024-01',
      status: 'paid',
      paymentMethod: 'UPI'
    },
    {
      id: '2',
      studentName: 'Sarah Smith',
      className: 'Physics Grade 12',
      amount: 3000,
      date: '2024-01-20',
      month: '2024-01',
      status: 'paid',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      className: 'Chemistry Grade 11',
      amount: 2800,
      date: '2024-01-25',
      month: '2024-01',
      status: 'paid',
      paymentMethod: 'Cash'
    },
    {
      id: '4',
      studentName: 'Emma Wilson',
      className: 'Mathematics Grade 10',
      amount: 2500,
      date: '2024-02-05',
      month: '2024-02',
      status: 'paid',
      paymentMethod: 'UPI'
    },
    {
      id: '5',
      studentName: 'David Brown',
      className: 'Physics Grade 12',
      amount: 3000,
      date: '2024-02-10',
      month: '2024-02',
      status: 'paid',
      paymentMethod: 'UPI'
    },
    {
      id: '6',
      studentName: 'Lisa Davis',
      className: 'Chemistry Grade 11',
      amount: 2800,
      date: '2024-02-15',
      month: '2024-02',
      status: 'pending',
      paymentMethod: 'Pending'
    }
  ];

  const classes = ['Mathematics Grade 10', 'Physics Grade 12', 'Chemistry Grade 11'];
  const months = ['2024-01', '2024-02', '2024-03'];

  // Filter earnings based on selected criteria
  const getFilteredEarnings = () => {
    let filtered = earningsData;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(earning => 
        earning.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.className.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected criteria
    switch (selectedFilter) {
      case 'month':
        filtered = filtered.filter(earning => earning.month === selectedMonth);
        break;
      case 'class':
        // For demo, we'll show all classes, but you can add class selection
        break;
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(earning => earning.date === today);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredEarnings = getFilteredEarnings();

  // Calculate total earnings
  const totalEarnings = filteredEarnings
    .filter(earning => earning.status === 'paid')
    .reduce((sum, earning) => sum + earning.amount, 0);

  const pendingEarnings = filteredEarnings
    .filter(earning => earning.status === 'pending')
    .reduce((sum, earning) => sum + earning.amount, 0);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status) => {
    return status === 'paid' ? '#10B981' : '#F59E0B';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <Text style={styles.headerSubtitle}>Manage your income</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.totalCard]}>
          <Ionicons name="trending-up" size={24} color="#4467EE" />
          <Text style={styles.summaryAmount}>{formatCurrency(totalEarnings)}</Text>
          <Text style={styles.summaryLabel}>Total Received</Text>
        </View>
        
        <View style={[styles.summaryCard, styles.pendingCard]}>
          <Ionicons name="time-outline" size={24} color="#F59E0B" />
          <Text style={styles.summaryAmount}>{formatCurrency(pendingEarnings)}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student or class name..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All Time
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'today' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('today')}
        >
          <Text style={[styles.filterText, selectedFilter === 'today' && styles.activeFilterText]}>
            Today
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'month' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('month')}
        >
          <Text style={[styles.filterText, selectedFilter === 'month' && styles.activeFilterText]}>
            This Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'class' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('class')}
        >
          <Text style={[styles.filterText, selectedFilter === 'class' && styles.activeFilterText]}>
            By Class
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Month Selector (shown when month filter is active) */}
      {selectedFilter === 'month' && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.monthContainer}
        >
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              style={[styles.monthTab, selectedMonth === month && styles.activeMonthTab]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[styles.monthText, selectedMonth === month && styles.activeMonthText]}>
                {new Date(month + '-01').toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Earnings List */}
      <ScrollView style={styles.earningsList}>
        {filteredEarnings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={80} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No Earnings Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'No earnings match your current filters'
              }
            </Text>
          </View>
        ) : (
          filteredEarnings.map((earning) => (
            <View key={earning.id} style={styles.earningCard}>
              <View style={styles.earningHeader}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{earning.studentName}</Text>
                  <Text style={styles.className}>{earning.className}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amount}>{formatCurrency(earning.amount)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(earning.status)}20` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(earning.status) }]}>
                      {earning.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.earningDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {new Date(earning.date).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="card-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{earning.paymentMethod}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4467EE',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  totalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4467EE',
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#4467EE',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: 'white',
  },
  monthContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  monthTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeMonthTab: {
    backgroundColor: '#4467EE20',
  },
  monthText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeMonthText: {
    color: '#4467EE',
    fontWeight: '600',
  },
  earningsList: {
    flex: 1,
    paddingHorizontal: 20,
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
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  earningCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  className: {
    fontSize: 14,
    color: '#4467EE',
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  earningDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
});