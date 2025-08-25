<template>
  <div class="dashboard">
    <!-- Header -->
    <!-- <header class="header">
      <div class="logo">EventQR</div>
      <div class="title">Dashboard</div>
      <div class="user-section">
        <span class="bell-icon">🔔</span>
        <span class="user-name">John Doe</span>
      </div>
      <button class="menu-toggle" @click="toggleSidebar" aria-label="Toggle menu">
        <span v-if="!sidebarOpen">☰</span>
        <span v-else>✖</span>
      </button>
    </header> -->

    <!-- Sidebar -->
    <!-- <transition name="slide">
      <aside v-if="sidebarOpen || !isMobile" class="sidebar">
        <nav>
          <ul>
            <li>
              <router-link to="/" active-class="active" exact>
                <span class="icon">🏠</span>
                <span class="label">Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/create-invitation" active-class="active">
                <span class="icon">📩</span>
                <span class="label">Create Invitation</span>
              </router-link>
            </li>
            <li>
              <router-link to="/qr-scanner" active-class="active">
                <span class="icon">🔍</span>
                <span class="label">QR Scanner</span>
              </router-link>
            </li>
            <li>
              <router-link to="/settings" active-class="active">
                <span class="icon">⚙️</span>
                <span class="label">Settings</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
    </transition> -->

    <!-- Main Content -->
    <main class="main-content">
      <h1 class="main-title">Welcome back, John Doe!</h1>
      <p class="main-subtitle">Here's what's happening with your events today.</p>

      <!-- Stats -->
      <div class="stats">
        <div class="stat-card">
          <span class="icon">📅</span>
          <div class="stat-label">Active Events</div>
          <div class="number">{{ activeEvents }}</div>
        </div>
        <div class="stat-card">
          <span class="icon">👥</span>
          <div class="stat-label">Total Guests</div>
          <div class="number">{{ totalGuests }}</div>
        </div>
        <div class="stat-card confirmed">
          <span class="icon">✅</span>
          <div class="stat-label">Confirmed</div>
          <div class="number">{{ confirmed }}</div>
        </div>
        <div class="stat-card pending">
          <span class="icon">⏳</span>
          <div class="stat-label">Pending</div>
          <div class="number">{{ pending }}</div>
        </div>
      </div>

      <!-- Events Section -->
      <section class="events-section">
        <div class="section-header">
          <h2>Your Events</h2>
          <button class="create-button">+ Create New Event</button>
        </div>
        <div class="event-cards">
          <div
            v-for="event in events"
            :key="event.title"
            :class="['event-card', { active: event.active }]"
          >
            <img :src="event.image" :alt="event.title" />
            <div class="event-details">
              <h3>{{ event.title }}</h3>
              <div class="event-meta">
                <span>📅 {{ event.date }}</span>
                <span>🏨 {{ event.location }}</span>
              </div>
              <p class="guests"><strong>{{ event.guests }}</strong> guests confirmed</p>
              <span v-if="event.active" class="active-tag">active</span>
              <div class="event-actions">
                <button v-if="event.active">Preview</button>
                <button>Manage Guests</button>
              </div>
            </div>
          </div>
        </div>
        <div class="create-event-placeholder">
          <div class="plus-icon">+</div>
          <p>Create a new event invitation.</p>
          <button>+ New Event</button>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="recent-activity">
        <div class="section-header">
          <h2>Recent Activity</h2>
          <a href="#">View All</a>
        </div>
        <ul>
          <li
            v-for="activity in recentActivity"
            :key="activity.user + activity.time"
            :class="['activity-item', activity.type]"
          >
            <span class="icon">
              <template v-if="activity.type === 'confirmed'">✅</template>
              <template v-else-if="activity.type === 'received'">📩</template>
              <template v-else-if="activity.type === 'checked-in'">📍</template>
            </span>
            <div>
              <strong>{{ activity.user }}</strong>
              <div>{{ activity.action }}</div>
            </div>
            <span class="time">{{ activity.time }}</span>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      activeEvents: 5,
      totalGuests: 342,
      confirmed: 218,
      pending: 124,
      events: [
        {
          title: 'Annual Company Gala',
          date: 'Oct 15, 2023',
          location: 'Grand Hyatt Hotel',
          guests: '85/120',
          image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: 'Tech Conference 2023',
          date: 'Nov 5, 2023',
          location: 'Convention Center',
          guests: '180/250',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: 'Product Launch Party',
          date: 'Dec 1, 2023',
          location: 'Skyline Lounge',
          guests: '50/80',
          active: true,
          image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
        }
      ],
      recentActivity: [
        {
          user: 'Emma Watson',
          action: 'Confirmed attendance for Annual Company Gala',
          time: '2 hours ago',
          type: 'confirmed'
        },
        {
          user: 'John Smith',
          action: 'Received invitation for Tech Conference 2023',
          time: '5 hours ago',
          type: 'received'
        },
        {
          user: 'Michael Brown',
          action: 'Checked in at Product Launch Party',
          time: '1 day ago',
          type: 'checked-in'
        }
      ],
      sidebarOpen: false,
      activeMenu: 'dashboard',
      isMobile: false
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    setActive(menu) {
      this.activeMenu = menu;
      if (this.isMobile) this.sidebarOpen = false;
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 700;
      if (!this.isMobile) this.sidebarOpen = true;
      else this.sidebarOpen = false;
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(135deg, #f8f9fd 60%, #e0e7ff 100%);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(90deg, #6a5acd 0%, #8f94fb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(106,90,205,0.12);
  z-index: 10;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  cursor: pointer;
  margin-left: 16px;
}

.logo {
  font-size: 1.4em;
  font-weight: bold;
  letter-spacing: 1px;
}

.title {
  font-weight: bold;
  font-size: 1.1em;
}

.user-section {
  display: flex;
  align-items: center;
}

.bell-icon {
  margin-right: 10px;
  font-size: 1.2em;
}

/* Sidebar Styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  width: 220px;
  background: #fff;
  padding: 30px 0 0 0;
  box-shadow: 2px 0 8px rgba(106,90,205,0.07);
  z-index: 9;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

.sidebar nav li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 32px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 1.08em;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.sidebar nav li.active,
.sidebar nav li:hover {
  background: #e0e7ff;
  color: #6a5acd;
  font-weight: bold;
}

.sidebar nav .icon {
  font-size: 1.3em;
}

.sidebar nav .label {
  font-size: 1em;
}

.main-content {
  margin-left: 220px;
  margin-top: 60px;
  padding: 40px 32px 32px 32px;
  flex-grow: 1;
  overflow-y: auto;
  min-width: 0;
}

.main-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 6px;
}

.main-subtitle {
  font-size: 1.1em;
  color: #444;
  margin-bottom: 28px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 36px;
}

.stat-card {
  background: linear-gradient(135deg, #fff 80%, #e0e7ff 100%);
  box-shadow: 0 2px 12px rgba(106,90,205,0.08);
  padding: 18px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 4px 18px rgba(106,90,205,0.15);
}

.stat-card .icon {
  font-size: 2em;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1.08em;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-card .number {
  font-size: 2em;
  font-weight: bold;
  margin-top: 6px;
}

.confirmed {
  color: #22c55e;
}

.pending {
  color: #f59e42;
}

.events-section {
  margin-bottom: 36px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.create-button {
  background: linear-gradient(90deg, #6a5acd 0%, #8f94fb 100%);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(106,90,205,0.08);
  transition: background 0.2s;
}

.create-button:hover {
  background: linear-gradient(90deg, #8f94fb 0%, #6a5acd 100%);
}

.event-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.event-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(106,90,205,0.09);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.event-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 6px 20px rgba(106,90,205,0.13);
}

.event-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.event-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-details h3 {
  margin: 0 0 4px 0;
  font-size: 1.15em;
  font-weight: bold;
}

.event-meta {
  display: flex;
  gap: 16px;
  font-size: 0.98em;
  color: #555;
}

.guests {
  font-weight: bold;
  color: #6a5acd;
  margin-bottom: 4px;
}

.active-tag {
  background: #22c55e;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.95em;
  font-weight: bold;
  align-self: flex-start;
}

.event-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.event-card button {
  background: #e0e7ff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  font-size: 0.98em;
}

.event-card button:hover {
  background: #6a5acd;
  color: white;
}

.create-event-placeholder {
  background: #fff;
  border: 2px dashed #6a5acd;
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(106,90,205,0.07);
}

.plus-icon {
  font-size: 44px;
  color: #6a5acd;
  margin-bottom: 8px;
}

.create-event-placeholder button {
  background: linear-gradient(90deg, #6a5acd 0%, #8f94fb 100%);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

.create-event-placeholder button:hover {
  background: linear-gradient(90deg, #8f94fb 0%, #6a5acd 100%);
}

.recent-activity ul {
  list-style: none;
  padding: 0;
}

.activity-item {
  background: #fff;
  padding: 14px 18px;
  margin-bottom: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(106,90,205,0.07);
  transition: box-shadow 0.2s;
}

.activity-item:hover {
  box-shadow: 0 4px 16px rgba(106,90,205,0.13);
}

.activity-item .icon {
  font-size: 1.5em;
}

.time {
  margin-left: auto;
  color: #6a5acd;
  font-size: 0.95em;
  font-weight: 500;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .event-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .sidebar {
    width: 60px;
    padding: 18px 0 0 0;
  }
  .main-content {
    margin-left: 60px;
    padding: 24px 8px 24px 8px;
  }
  .sidebar nav li .label {
    display: none;
  }
  .sidebar nav li {
    justify-content: center;
    padding: 12px 0;
  }
  .event-cards {
    grid-template-columns: 1fr;
  }
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 700px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100vw;
    height: auto;
    flex-direction: row;
    box-shadow: 0 2px 8px rgba(106,90,205,0.07);
    padding: 0;
    z-index: 11;
  }
  .sidebar nav ul {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    margin: 0;
  }
  .sidebar nav li {
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 0;
    margin-bottom: 0;
    font-size: 1em;
  }
  .sidebar nav li .label {
    display: block;
    font-size: 0.9em;
  }
  .main-content {
    margin-left: 0;
    margin-top: 70px;
    padding: 16px 4px 16px 4px;
  }
  .stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .event-cards {
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: center;
  }
  .event-card {
    width: 100%;
    min-width: 0;
  }
  .menu-toggle {
    display: block;
  }
}

@media (max-width: 500px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 10px 6px;
    font-size: 0.95em;
  }
  .sidebar {
    font-size: 0.95em;
  }
  .main-content {
    padding: 8px 2px 8px 2px;
  }
  .event-card {
    width: 100vw;
    min-width: 0;
  }
}

/* Sidebar slide animation */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.sidebar .active {
  background: #e0e7ff;
  color: #6a5acd;
  font-weight: bold;
  border-radius: 8px;
}
</style>