<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="logo">EventQR</div>
      <nav>
        <ul>
          <li><router-link to="/"><i class="fas fa-home"></i> Dashboard</router-link></li>
          <li><router-link to="/create-invitation"><i class="fas fa-envelope"></i> Create Invitation</router-link></li>
          <li><router-link to="/qr-scanner"><i class="fas fa-qrcode"></i> QR Scanner</router-link></li>
          <li><router-link to="/settings"><i class="fas fa-cog"></i> Settings</router-link></li>
        </ul>
      </nav>
      <div class="logout">
        <i class="fas fa-sign-out-alt"></i> Logout
      </div>
    </aside>
    <div class="main-content">
      <header class="header">
        <!-- <div class="logo">EventQR</div> -->
        <div class="title">{{ pageTitle }}</div>
        <div class="user-section">
          <span class="bell-icon">🔔</span>
          <span class="user-name">John Doe</span>
        </div>
      </header>
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  computed: {
    pageTitle() {
      // Optionally, use route meta or path to set the title dynamically
      const map = {
        '/': 'Dashboard',
        '/create-invitation': 'Create Invitation',
        '/qr-scanner': 'QR Scanner',
        '/settings': 'Settings'
      };
      return map[this.$route.path] || 'Dashboard';
    }
  }
};
</script>

<style scoped>
/* Copy your sidebar and layout styles here from Scanner.vue */
.main-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fd;
  font-family: 'Montserrat', Arial, sans-serif;
}
.sidebar {
  width: 220px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(106,90,205,0.07);
  display: flex;
  flex-direction: column;
  padding: 32px 0 0 0;
  min-height: 100vh;
}
.logo {
  font-size: 1.4em;
  font-weight: bold;
  color: #6a5acd;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 1px;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar nav li {
  margin-bottom: 12px;
  padding: 0 32px;
}
.sidebar nav li.active,
.sidebar nav li:hover {
  background: #e0e7ff;
  border-radius: 8px;
}
.sidebar nav a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}
.logout {
  margin-top: auto;
  padding: 24px 32px;
  color: #6a5acd;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}
.main-content {
  flex: 1;
  min-width: 0;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.title {
  font-size: 1.2em;
  font-weight: 500;
  color: #333;
}
.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bell-icon {
  font-size: 1.2em;
  color: #6a5acd;
}
.user-name {
  font-size: 1em;
  color: #666;
}
.page-content {
  padding: 32px;
  background: #f8f9fd;
  min-height: calc(100vh - 64px);
}
@media (max-width: 700px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100vw;
    flex-direction: row;
    align-items: center;
    padding: 12px 0;
    min-height: 0;
    box-shadow: 0 2px 8px #6a5acd11;
  }
  .sidebar nav ul {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: center;
    width: 100%;
  }
  .sidebar nav li {
    margin-bottom: 0;
    padding: 0 8px;
  }
  .logout {
    display: none;
  }
}
</style>