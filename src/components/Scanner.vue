<template>
  <div class="scanner-layout">
    

    <!-- Main Content -->
    <div class="main">
      <!-- Header -->
      <!-- <header class="header">
        <div class="title">QR Scanner</div>
        <div class="user-section">
          <i class="fas fa-bell"></i>
          <span class="user-avatar"><i class="fas fa-user"></i></span>
          <span class="user-name">John Doe</span>
        </div>
      </header> -->

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- QR Scanner Card -->
        <section class="scanner-card">
          <div class="card-header">
            <span>QR Code Scanner</span>
            <button class="tips-btn"><i class="fas fa-info-circle"></i> Tips</button>
          </div>
          <div class="scanner-box">
            <div class="camera-denied">
              <i class="fas fa-exclamation-circle error-icon"></i>
              <div class="camera-title">Camera Access Denied</div>
              <div class="camera-desc">
                Please enable camera access in your browser settings to use the QR scanner.
              </div>
              <button class="try-btn"><i class="fas fa-sync-alt"></i> Try Again</button>
            </div>
          </div>
          <div class="manual-entry">
            Having trouble scanning? <a href="#">Enter code manually</a>
          </div>
        </section>

        <!-- Statistics & Recent Scans -->
        <aside class="side-info">
          <div class="stats-card">
            <div class="stats-title">
              Statistics <i class="fas fa-shield-alt"></i>
            </div>
            <div class="stats-grid">
              <div class="stat total">
                <div class="stat-label">Total</div>
                <div class="stat-value">0</div>
              </div>
              <div class="stat verified">
                <div class="stat-label">Verified</div>
                <div class="stat-value">0</div>
              </div>
              <div class="stat rejected">
                <div class="stat-label">Rejected</div>
                <div class="stat-value">0</div>
              </div>
            </div>
          </div>
          <div class="recent-card">
            <div class="recent-title">Recent Scans</div>
            <div class="recent-list">
              <div class="empty">No recent scans</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scanner'
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
.scanner-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fd;
  font-family: 'Montserrat', Arial, sans-serif;
}
/* .sidebar {
  width: 220px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(106,90,205,0.07);
  display: flex;
  flex-direction: column;
  padding: 32px 0 0 0;
  min-height: 100vh;
} */
.logo {
  font-size: 1.4em;
  font-weight: bold;
  color: #6a5acd;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 1px;
}
/* .sidebar nav ul {
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
} */
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
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid #e0e7ff;
}
.title {
  font-size: 1.3em;
  font-weight: bold;
  color: #222;
}
.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-avatar {
  background: #e0e7ff;
  border-radius: 50%;
  padding: 6px;
  color: #6a5acd;
  font-size: 1.1em;
}
.user-name {
  font-weight: 500;
  color: #444;
}
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  padding: 40px 40px 0 40px;
  flex: 1;
}
.scanner-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(106,90,205,0.12);
  padding: 32px 36px 24px 36px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 12px;
}
.tips-btn {
  background: #f8f9fd;
  border: none;
  color: #6a5acd;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.tips-btn:hover {
  background: #e0e7ff;
}
.scanner-box {
  background: #111;
  border-radius: 12px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
}
.camera-denied {
  text-align: center;
  color: #e0e7ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.error-icon {
  font-size: 2.5em;
  color: #f43f5e;
}
.camera-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
}
.camera-desc {
  color: #e0e7ff;
  font-size: 1em;
  margin-bottom: 8px;
}
.try-btn {
  background: #6a5acd;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.try-btn:hover {
  background: #8f94fb;
}
.manual-entry {
  text-align: center;
  font-size: 1em;
  color: #444;
  margin-top: 8px;
}
.manual-entry a {
  color: #6a5acd;
  text-decoration: underline;
  font-weight: 500;
}
.side-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.stats-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(106,90,205,0.08);
  padding: 18px 24px;
  margin-bottom: 12px;
}
.stats-title {
  font-weight: 600;
  font-size: 1.08em;
  color: #6a5acd;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.stats-grid {
  display: flex;
  gap: 18px;
}
.stat {
  background: #f8f9fd;
  border-radius: 8px;
  padding: 12px 18px;
  text-align: center;
  flex: 1;
  box-shadow: 0 2px 8px #6a5acd11;
}
.stat-label {
  font-size: 1em;
  color: #888;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 1.3em;
  font-weight: bold;
  color: #222;
}
.verified .stat-value {
  color: #22c55e;
}
.rejected .stat-value {
  color: #f43f5e;
}
.recent-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(106,90,205,0.08);
  padding: 18px 24px;
}
.recent-title {
  font-weight: 600;
  font-size: 1.08em;
  color: #6a5acd;
  margin-bottom: 10px;
}
.recent-list {
  min-height: 40px;
  color: #888;
  font-size: 1em;
}
.empty {
  color: #aaa;
  text-align: center;
  padding: 12px 0;
}

/* Responsive */
@media (max-width: 1100px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 24px 8px 0 8px;
  }
  .side-info {
    flex-direction: row;
    gap: 18px;
  }
  .stats-card, .recent-card {
    flex: 1;
    margin-bottom: 0;
  }
}
@media (max-width: 700px) {
  .scanner-layout {
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
  .main {
    padding-top: 0;
  }
  .header {
    padding: 0 12px;
    height: auto;
    flex-direction: column;
    gap: 8px;
  }
  .content-grid {
    padding: 12px 2px 0 2px;
  }
}
</style>