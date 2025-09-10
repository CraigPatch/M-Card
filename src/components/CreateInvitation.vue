<template>
  <div class="create-invitation-page">
    <header class="top-header">
    </header>

    <div class="steps">
      <div :class="['step', {active: step === 1}]">
        <span class="circle">1</span>
        <span>Event Details</span>
      </div>
      <div :class="['step', {active: step === 2}]">
        <span class="circle">2</span>
        <span>Design</span>
      </div>
      <div :class="['step', {active: step === 3}]">
        <span class="circle">3</span>
        <span>Guest Management</span>
      </div>
      <div :class="['step', {active: step === 4}]">
        <span class="circle">4</span>
        <span>Preview & Finalize</span>
      </div>
    </div>

    <div class="form-card">
      <!-- Step 1: Event Details -->
      <form v-if="step === 1" @submit.prevent="nextStep">
        <h3>Event Details</h3>
        <div class="form-row">
          <label>Event Title</label>
          <input type="text" v-model="form.title" placeholder="Annual Company Gala" required />
        </div>
        <div class="form-row date-time-row">
          <div>
            <label>Date</label>
            <input type="date" v-model="form.date" required />
          </div>
          <div>
            <label>Time</label>
            <input type="time" v-model="form.time" required />
          </div>
        </div>
        <div class="form-row">
          <label>Location</label>
          <input type="text" v-model="form.location" placeholder="Grand Hyatt Hotel, 123 Main St, City" required />
        </div>
        <div class="form-row">
          <label>Event Description</label>
          <textarea v-model="form.description" placeholder="Join us for an evening of celebration..." rows="3"></textarea>
        </div>
        <div class="form-row organizer-row">
          <div>
            <label>Organizer / Host</label>
            <input type="text" v-model="form.organizer" placeholder="Company Name or Host Name" />
          </div>
          <div>
            <label>Contact Email</label>
            <input type="email" v-model="form.email" placeholder="contact@example.com" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="back-btn" disabled>Back</button>
          <button type="submit" class="continue-btn">Continue <span>→</span></button>
        </div>
      </form>

      <!-- Step 2: Design -->
      <form v-if="step === 2" @submit.prevent="nextStep">
        <h3 class="step-title">Choose a Template</h3>
        <div class="template-grid">
          <div
            v-for="template in templates"
            :key="template.id"
            :class="['template-card', {selected: form.templateId === template.id}]"
            @click="form.templateId = template.id"
          >
            <img :src="template.image" :alt="template.name" />
            <div class="template-footer">
              <span>{{ template.name }}</span>
              <span v-if="form.templateId === template.id" class="checkmark">
                <i class="fas fa-check-circle"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="color-customization">
          <label>Customize Colors</label>
          <div class="color-swatches">
            <span
              v-for="color in colors"
              :key="color"
              :style="{background: color}"
              :class="['swatch', {active: form.color === color}]"
              @click="form.color = color"
            ></span>
            <input type="color" v-model="form.color" class="swatch custom-color" />
          </div>
        </div>
        <div class="design-options">
          <div class="option-card">
            <label for="image-upload">
              <i class="fas fa-image"></i> Add Images
              <span class="option-desc">Upload custom images</span>
              <input id="image-upload" type="file" accept="image/*" @change="handleImageUpload" hidden />
            </label>
          </div>
          <div class="option-card">
            <i class="fas fa-font"></i> Change Fonts
            <span class="option-desc">Customize typography</span>
          </div>
          <div class="option-card">
            <i class="fas fa-th-large"></i> Edit Layout
            <span class="option-desc">Customize arrangement</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="back-btn" @click="prevStep">Back</button>
          <button type="submit" class="continue-btn">Continue <span>→</span></button>
        </div>
      </form>

      <!-- Step 3: Guest Management -->
      <form v-if="step === 3" @submit.prevent="nextStep">
        <h3 class="step-title">Guest Management</h3>
        
        <!-- Add Guest Section -->
        <div class="guest-section">
          <div class="section-header">
            <h4>Add Guests</h4>
            <span class="guest-count">{{ guests.length }} guests added</span>
          </div>
          
          <div class="add-guest-form">
            <div class="guest-inputs">
              <input 
                type="text" 
                v-model="newGuest.name" 
                placeholder="Guest Name" 
                class="guest-input"
              />
              <input 
                type="email" 
                v-model="newGuest.email" 
                placeholder="Guest Email" 
                class="guest-input"
              />
              <input 
                type="tel" 
                v-model="newGuest.phone" 
                placeholder="Phone (optional)" 
                class="guest-input"
              />
              <select v-model="newGuest.type" class="guest-input">
                <option value="regular">Regular</option>
                <option value="vip">VIP</option>
                <option value="speaker">Speaker</option>
                <option value="staff">Staff</option>
              </select>
              <button type="button" @click="addGuest" class="add-guest-btn">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>

          <!-- Bulk Import -->
          <div class="bulk-import">
            <label for="csv-upload" class="upload-label">
              <i class="fas fa-upload"></i> Import from CSV
              <input id="csv-upload" type="file" accept=".csv" @change="handleCSVUpload" hidden />
            </label>
            <span class="import-info">Upload CSV with columns: Name, Email, Phone, Type</span>
          </div>
        </div>

        <!-- Guest List -->
        <div class="guest-list-section">
          <div class="section-header">
            <h4>Guest List</h4>
            <div class="list-actions">
              <button type="button" @click="selectAllGuests" class="action-btn">
                <i class="fas fa-check-square"></i> Select All
              </button>
              <button type="button" @click="generateSelectedCards" class="action-btn primary">
                <i class="fas fa-id-card"></i> Generate Cards
              </button>
            </div>
          </div>

          <div class="guest-table">
            <div class="table-header">
              <div class="col-checkbox">
                <input type="checkbox" @change="toggleAllSelection" :checked="allSelected" />
              </div>
              <div class="col-name">Name</div>
              <div class="col-email">Email</div>
              <div class="col-type">Type</div>
              <div class="col-status">Card Status</div>
              <div class="col-actions">Actions</div>
            </div>
            
            <div v-for="(guest, index) in guests" :key="index" class="table-row">
              <div class="col-checkbox">
                <input type="checkbox" v-model="guest.selected" />
              </div>
              <div class="col-name">
                <div class="guest-name">{{ guest.name }}</div>
              </div>
              <div class="col-email">{{ guest.email }}</div>
              <div class="col-type">
                <span :class="['type-badge', guest.type]">{{ guest.type.toUpperCase() }}</span>
              </div>
              <div class="col-status">
                <span :class="['status-badge', guest.cardGenerated ? 'generated' : 'pending']">
                  <i :class="guest.cardGenerated ? 'fas fa-check-circle' : 'fas fa-clock'"></i>
                  {{ guest.cardGenerated ? 'Generated' : 'Pending' }}
                </span>
              </div>
              <div class="col-actions">
                <button 
                  type="button" 
                  @click="generateSingleCard(index)" 
                  class="mini-btn"
                  :disabled="guest.cardGenerated"
                >
                  <i class="fas fa-id-card"></i>
                </button>
                <button 
                  type="button" 
                  @click="previewGuestCard(index)" 
                  class="mini-btn"
                  v-if="guest.cardGenerated"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  type="button" 
                  @click="downloadGuestCard(index)" 
                  class="mini-btn"
                  v-if="guest.cardGenerated"
                >
                  <i class="fas fa-download"></i>
                </button>
                <button type="button" @click="removeGuest(index)" class="mini-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="guests.length === 0" class="empty-state">
            <i class="fas fa-users"></i>
            <p>No guests added yet</p>
            <span>Start by adding guests above</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="back-btn" @click="prevStep">Back</button>
          <button type="submit" class="continue-btn">Continue <span>→</span></button>
        </div>
      </form>

      <!-- Step 4: Preview & Finalize -->
      <form v-if="step === 4" @submit.prevent="submitInvitation">
        <h3 class="step-title">Preview & Finalize</h3>
        <div class="step4-container">
          <div class="preview-panel">
            <div class="preview-title">Master Invitation Preview</div>
            <div
              class="invitation-preview-card"
              :style="{
                background: form.color,
                fontFamily: form.fontFamily,
                textAlign: form.textAlign,
                borderRadius: form.layout === 'Minimal' ? '0px' : '12px',
                boxShadow: form.layout === 'Futuristic' ? '0 0 24px #8f94fb88' : '0 2px 12px #a259ff22'
              }"
            >
              <img
                v-if="form.showImage"
                :src="selectedTemplate.image"
                class="preview-card-image"
                :style="{borderRadius: form.layout === 'Minimal' ? '0px' : '12px'}"
              />
              <div class="preview-card-content">
                <div class="preview-label" :style="{color: form.textColor}">INVITATION</div>
                <div
                  class="preview-title-main"
                  :style="{
                    color: form.textColor,
                    fontWeight: form.bold ? 'bold' : 'normal',
                    fontStyle: form.italic ? 'italic' : 'normal',
                    textDecoration: form.underline ? 'underline' : 'none'
                  }"
                >
                  {{ form.title || 'Event Title' }}
                </div>
                <div class="preview-details" :style="{color: form.textColor}">
                  <div><i class="fas fa-calendar"></i> {{ form.date || 'Date' }} {{ form.time || '' }}</div>
                  <div><i class="fas fa-map-marker-alt"></i> {{ form.location || 'Location' }}</div>
                </div>
                <div class="preview-desc" :style="{color: form.textColor}">
                  {{ form.description || 'Event description will appear here. Add details about your event to help guests know what to expect.' }}
                </div>
                <div class="preview-host" :style="{color: form.textColor}">
                  Hosted by: <span>{{ form.organizer || 'Host' }}</span>
                </div>
                <div class="preview-qr" v-if="form.showQR">
                  <img :src="qrCodeUrl" :style="{width: form.qrSize + 'px', height: form.qrSize + 'px'}" alt="QR Code" />
                  <div class="qr-label">{{ form.qrLabel }}</div>
                </div>
              </div>
            </div>

            <!-- Individual Guest Cards Preview -->
            <div class="guest-cards-preview" v-if="guests.length > 0">
              <div class="preview-title">Individual Guest Cards</div>
              <div class="cards-grid">
                <div 
                  v-for="(guest, index) in guests.slice(0, 4)" 
                  :key="index"
                  class="guest-card-preview"
                  :style="{
                    background: form.color,
                    borderRadius: form.layout === 'Minimal' ? '0px' : '8px'
                  }"
                >
                  <div class="card-header">
                    <span class="card-type" :style="{color: form.textColor}">{{ guest.type.toUpperCase() }}</span>
                  </div>
                  <div class="card-content">
                    <h4 :style="{color: form.textColor}">{{ guest.name }}</h4>
                    <div class="card-event-info" :style="{color: form.textColor}">
                      <div class="event-title">{{ form.title }}</div>
                      <div class="event-date">{{ form.date }} {{ form.time }}</div>
                    </div>
                    <div class="card-qr">
                      <img :src="generateGuestQR(guest)" alt="Guest QR" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="guests.length > 4" class="more-cards">
                + {{ guests.length - 4 }} more cards will be generated
              </div>
            </div>
          </div>

          <div class="controls-panel step4-controls">
            <div class="controls-tabs">
              <button :class="{active:activeTab==='design'}" @click="activeTab='design'">Design</button>
              <button :class="{active:activeTab==='layout'}" @click="activeTab='layout'">Layout</button>
              <button :class="{active:activeTab==='text'}" @click="activeTab='text'">Text</button>
              <button :class="{active:activeTab==='qr'}" @click="activeTab='qr'">QR Code</button>
            </div>
            <div class="controls-content">
              <!-- DESIGN TAB -->
              <div v-show="activeTab==='design'" class="controls-section">
                <h4 class="controls-title">Design</h4>
                <label>Background</label>
                <div class="template-images">
                  <img
                    v-for="template in templates"
                    :key="template.id"
                    :src="template.image"
                    :class="{selected: form.templateId === template.id}"
                    @click="form.templateId = template.id; form.showImage = true"
                  />
                </div>
                <label class="upload-btn">
                  <input type="file" accept="image/*" @change="handleImageUpload" hidden />
                  <span><i class="fas fa-upload"></i> Upload Image</span>
                </label>
                <label>
                  <input type="checkbox" v-model="form.showImage" /> Show Image
                </label>
                <label>Colors</label>
                <div class="color-swatches">
                  <span
                    v-for="color in colors"
                    :key="color"
                    :style="{background: color}"
                    :class="['swatch', {active: form.color === color}]"
                    @click="form.color = color"
                  ></span>
                </div>
              </div>
              <!-- LAYOUT TAB -->
              <div v-show="activeTab==='layout'" class="controls-section">
                <h4 class="controls-title">Layout</h4>
                <label>Layout Style</label>
                <div class="layout-options">
                  <button
                    v-for="layout in layouts"
                    :key="layout"
                    :class="['element-btn', {active: form.layout === layout}]"
                    @click="form.layout = layout"
                  >{{ layout }}</button>
                </div>
                <label>Text Alignment</label>
                <div class="align-btns">
                  <button @click="form.textAlign = 'left'"><i class="fas fa-align-left"></i></button>
                  <button @click="form.textAlign = 'center'"><i class="fas fa-align-center"></i></button>
                  <button @click="form.textAlign = 'right'"><i class="fas fa-align-right"></i></button>
                </div>
              </div>
              <!-- TEXT TAB -->
              <div v-show="activeTab==='text'" class="controls-section">
                <h4 class="controls-title">Text</h4>
                <label>Font Family</label>
                <select v-model="form.fontFamily">
                  <option value="Inter">Inter</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Roboto">Roboto</option>
                </select>
                <label>Text Styling</label>
                <div class="text-style-btns">
                  <button @click="form.bold = !form.bold" :class="{active: form.bold}"><b>B</b></button>
                  <button @click="form.italic = !form.italic" :class="{active: form.italic}"><i>I</i></button>
                  <button @click="form.underline = !form.underline" :class="{active: form.underline}"><u>U</u></button>
                </div>
                <label>Text Color</label>
                <div class="color-swatches">
                  <span
                    v-for="color in colors"
                    :key="color"
                    :style="{background: color}"
                    :class="['swatch', {active: form.textColor === color}]"
                    @click="form.textColor = color"
                  ></span>
                </div>
              </div>
              <!-- QR TAB -->
              <div v-show="activeTab==='qr'" class="controls-section">
                <h4 class="controls-title">QR Code</h4>
                <label>
                  <input type="checkbox" v-model="form.showQR" /> Show QR Code on Master Invitation
                </label>
                <label>QR Code Size</label>
                <input type="range" min="40" max="120" v-model="form.qrSize" />
                <label>QR Code Label</label>
                <input type="text" v-model="form.qrLabel" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Advanced Options & Save/Share -->
        <div class="advanced-options">
          <div class="save-share">
            <button type="button" class="save-btn" @click="saveDraft">Save as Draft</button>
            <button type="button" class="export-btn" @click="exportAllCards">Export All Cards</button>
            <button type="button" class="share-btn">Share Master Invitation</button>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="back-btn" @click="prevStep">Back</button>
          <button type="submit" class="continue-btn">Create Event & Generate Cards <span>→</span></button>
        </div>
      </form>
    </div>

    <!-- Guest Card Preview Modal -->
    <div v-if="showCardModal" class="modal-overlay" @click="closeCardModal">
      <div class="card-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedGuestForPreview?.name }} - Invitation Card</h3>
          <button @click="closeCardModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-content">
          <div 
            class="full-guest-card"
            :style="{
              background: form.color,
              borderRadius: form.layout === 'Minimal' ? '0px' : '12px'
            }"
          >
            <div class="full-card-header">
              <span class="invitation-label" :style="{color: form.textColor}">INVITATION</span>
              <span class="guest-type" :style="{color: form.textColor}">{{ selectedGuestForPreview?.type.toUpperCase() }}</span>
            </div>
            <div class="full-card-content">
              <h2 class="guest-name" :style="{color: form.textColor}">{{ selectedGuestForPreview?.name }}</h2>
              <div class="event-details" :style="{color: form.textColor}">
                <h3>{{ form.title }}</h3>
                <div class="event-info">
                  <div><i class="fas fa-calendar"></i> {{ form.date }} {{ form.time }}</div>
                  <div><i class="fas fa-map-marker-alt"></i> {{ form.location }}</div>
                </div>
                <p class="event-description">{{ form.description }}</p>
                <div class="host-info">Hosted by: {{ form.organizer }}</div>
              </div>
              <div class="card-qr-section">
                <img :src="generateGuestQR(selectedGuestForPreview)" alt="QR Code" class="qr-code" />
                <p class="qr-instruction">Present this QR code at the event</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="downloadGuestCard(selectedGuestIndex)" class="download-btn">
            <i class="fas fa-download"></i> Download Card
          </button>
          <button @click="sendGuestInvitation(selectedGuestIndex)" class="send-btn">
            <i class="fas fa-envelope"></i> Send to Guest
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateInvitation',
  data() {
    return {
      step: 1,
      form: {
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        organizer: '',
        email: '',
        templateId: 1,
        color: '#a259ff',
        fontFamily: 'Inter',
        textColor: '#6a5acd',
        showQR: true,
        qrSize: 80,
        qrLabel: 'Scan to RSVP',
        showImage: true,
        layout: 'Classic',
        textAlign: 'center',
        bold: false,
        italic: false,
        underline: false
      },
      newGuest: {
        name: '',
        email: '',
        phone: '',
        type: 'regular'
      },
      guests: [],
      templates: [
        { id: 1, name: 'Elegant Template', image: 'https://images.unsplash.com/photo-1515165562835-cf7747d3f1c2?auto=format&fit=crop&w=800&q=80' },
        { id: 2, name: 'Modern Template', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
        { id: 3, name: 'Festive Template', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80' },
        { id: 4, name: 'Corporate Template', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }
      ],
      colors: ['#6a5acd', '#22c55e', '#f59e42', '#f43f5e', '#a259ff', '#222', '#fff', '#000'],
      layouts: ['Classic', 'Modern', 'Minimal', 'Futuristic'],
      activeTab: 'design',
      showCardModal: false,
      selectedGuestForPreview: null,
      selectedGuestIndex: null
    };
  },
  computed: {
    selectedTemplate() {
      return this.templates.find(t => t.id === this.form.templateId) || this.templates[0];
    },
    qrCodeUrl() {
      return `https://api.qrserver.com/v1/create-qr-code/?size=${this.form.qrSize}x${this.form.qrSize}&data=RSVP`;
    },
    allSelected() {
      return this.guests.length > 0 && this.guests.every(guest => guest.selected);
    }
  },
  methods: {
    prevStep() {
      if (this.step > 1) this.step--;
    },
    nextStep() {
      if (this.step < 4) this.step++;
    },
    submitInvitation() {
      // Generate cards for all guests
      this.generateAllCards();
      alert(`Event created successfully! Generated ${this.guests.length} individual invitation cards.`);
      this.step = 1;
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.templates.push({
          id: this.templates.length + 1,
          name: 'Custom Image',
          image: evt.target.result
        });
        this.form.templateId = this.templates.length;
        this.form.showImage = true;
      };
      reader.readAsDataURL(file);
    },
    saveDraft() {
      const draftData = {
        form: this.form,
        guests: this.guests
      };
      // In a real app, you would save to a database
      alert('Draft saved! You can continue later.');
    },
    
    // Guest Management Methods
    addGuest() {
      if (!this.newGuest.name || !this.newGuest.email) {
        alert('Please enter at least name and email');
        return;
      }
      
      const guest = {
        ...this.newGuest,
        selected: false,
        cardGenerated: false,
        invitationId: this.generateGuestId()
      };
      
      this.guests.push(guest);
      this.resetNewGuest();
    },
    
    resetNewGuest() {
      this.newGuest = {
        name: '',
        email: '',
        phone: '',
        type: 'regular'
      };
    },
    
    removeGuest(index) {
      this.guests.splice(index, 1);
    },
    
    selectAllGuests() {
      const allSelected = this.guests.every(guest => guest.selected);
      this.guests.forEach(guest => guest.selected = !allSelected);
    },
    
    toggleAllSelection() {
      const newState = !this.allSelected;
      this.guests.forEach(guest => guest.selected = newState);
    },
    
    generateSingleCard(index) {
      this.guests[index].cardGenerated = true;
      // In a real app, you would generate the actual card file here
      alert(`Card generated for ${this.guests[index].name}`);
    },
    
    generateSelectedCards() {
      const selectedGuests = this.guests.filter(guest => guest.selected);
      if (selectedGuests.length === 0) {
        alert('Please select at least one guest');
        return;
      }
      
      selectedGuests.forEach(guest => {
        guest.cardGenerated = true;
      });
      
      alert(`Generated ${selectedGuests.length} cards successfully!`);
    },
    
    generateAllCards() {
      this.guests.forEach(guest => {
        guest.cardGenerated = true;
      });
    },
    
    previewGuestCard(index) {
      this.selectedGuestForPreview = this.guests[index];
      this.selectedGuestIndex = index;
      this.showCardModal = true;
    },
    
    closeCardModal() {
      this.showCardModal = false;
      this.selectedGuestForPreview = null;
      this.selectedGuestIndex = null;
    },
    
    downloadGuestCard(index) {
      const guest = this.guests[index];
      // In a real app, you would generate and download the actual card file
      alert(`Downloading card for ${guest.name}`);
    },
    
    sendGuestInvitation(index) {
      const guest = this.guests[index];
      // In a real app, you would send the invitation via email
      alert(`Invitation sent to ${guest.email}`);
    },
    
    exportAllCards() {
      const generatedCards = this.guests.filter(guest => guest.cardGenerated);
      if (generatedCards.length === 0) {
        alert('No cards have been generated yet');
        return;
      }
      // In a real app, you would generate and download all cards as a ZIP file
      alert(`Exporting ${generatedCards.length} cards as ZIP file`);
    },
    
    handleCSVUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        for (let i = 1; i < lines.length; i++) {
          const data = lines[i].split(',');
          if (data.length >= 2 && data[0].trim() && data[1].trim()) {
            const guest = {
              name: data[0].trim(),
              email: data[1].trim(),
              phone: data[2] ? data[2].trim() : '',
              type: data[3] ? data[3].trim().toLowerCase() : 'regular',
              selected: false,
              cardGenerated: false,
              invitationId: this.generateGuestId()
            };
            this.guests.push(guest);
          }
        }
        alert(`Imported ${lines.length - 1} guests from CSV`);
      };
      reader.readAsText(file);
    },
    
    generateGuestId() {
      return Math.random().toString(36).substr(2, 9);
    },
    
    generateGuestQR(guest) {
      if (!guest) return '';
      const qrData = `${guest.invitationId}-${guest.name}-${this.form.title}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;
    }
  },
  mounted() {
    // Load draft if exists
    const draft = JSON.parse(localStorage.getItem('invitationDraft') || '{}');
    if (draft.form) {
      this.form = { ...this.form, ...draft.form };
    }
    if (draft.guests) {
      this.guests = draft.guests;
    }
  }
};
</script>

<style scoped>
.create-invitation-page {
  padding: 0;
  min-height: 100vh;
  background: #f8f9fd;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 0 32px;
  background: transparent;
}

.steps {
  display: flex;
  gap: 40px;
  justify-content: flex-start;
  align-items: center;
  margin: 32px 0 24px 32px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #888;
  font-weight: 500;
}

.step .circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #6a5acd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 6px;
  font-size: 1.1em;
}

.step.active .circle {
  background: #6a5acd;
  color: #fff;
}

.step.active {
  color: #222;
}

.form-card {
  background: rgba(255,255,255,0.25);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(106,90,205,0.12);
  backdrop-filter: blur(8px);
  padding: 32px 36px 24px 36px;
  margin: 0 auto;
  max-width: 1200px;
  transition: box-shadow 0.2s;
}

.form-card:hover {
  box-shadow: 0 8px 32px rgba(106,90,205,0.18);
}

.form-card h3 {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 24px;
}

.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.form-row label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #444;
}

.form-row input,
.form-row textarea,
.form-row select {
  padding: 10px 12px;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  font-size: 1em;
  background: #f8f9fd;
  transition: border 0.2s;
}

.form-row input:focus,
.form-row textarea:focus,
.form-row select:focus {
  border-color: #6a5acd;
  outline: none;
}

.date-time-row,
.organizer-row {
  flex-direction: row;
  gap: 24px;
}

.date-time-row > div,
.organizer-row > div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Guest Management Styles */
.guest-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(106,90,205,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  font-size: 1.1em;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.guest-count {
  background: #e0e7ff;
  color: #6a5acd;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

.add-guest-form {
  margin-bottom: 16px;
}

.guest-inputs {
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.guest-input {
  padding: 10px 12px;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  font-size: 1em;
  background: #f8f9fd;
}

.add-guest-btn {
  background: #6a5acd;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
}

.add-guest-btn:hover {
  background: #8f94fb;
}

.bulk-import {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e7ff;
}

.upload-label {
  background: #f8f9fd;
  border: 1px dashed #6a5acd;
  color: #6a5acd;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.upload-label:hover {
  background: #e0e7ff;
}

.import-info {
  font-size: 0.9em;
  color: #666;
}

/* Guest List Table Styles */
.guest-list-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(106,90,205,0.08);
}

.list-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: #e0e7ff;
  color: #6a5acd;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9em;
}

.action-btn.primary {
  background: #6a5acd;
  color: #fff;
}

.action-btn:hover {
  background: #d1d5fa;
}

.action-btn.primary:hover {
  background: #8f94fb;
}

.guest-table {
  margin-top: 16px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 50px 2fr 2fr 1fr 1fr 120px;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e7ff;
}

.table-header {
  font-weight: 600;
  color: #444;
  background: #f8f9fd;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.table-row {
  padding: 12px 16px;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fd;
  border-radius: 8px;
}

.guest-name {
  font-weight: 500;
  color: #222;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.regular {
  background: #e0e7ff;
  color: #6a5acd;
}

.type-badge.vip {
  background: #fef3c7;
  color: #d97706;
}

.type-badge.speaker {
  background: #dcfce7;
  color: #16a34a;
}

.type-badge.staff {
  background: #e5e7eb;
  color: #374151;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
  font-weight: 500;
}

.status-badge.generated {
  color: #16a34a;
}

.status-badge.pending {
  color: #d97706;
}

.col-actions {
  display: flex;
  gap: 6px;
}

.mini-btn {
  background: #e0e7ff;
  border: none;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  color: #6a5acd;
  font-size: 0.9em;
  transition: background 0.2s;
}

.mini-btn:hover {
  background: #d1d5fa;
}

.mini-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.mini-btn.delete:hover {
  background: #fecaca;
}

.mini-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state i {
  font-size: 3em;
  color: #d1d5fa;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 1.1em;
  font-weight: 500;
  margin-bottom: 8px;
}

/* Template Grid Styles */
.step-title {
  font-size: 1.3em;
  font-weight: 600;
  margin-bottom: 18px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 18px;
}

.template-card {
  background: #fff;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px #6a5acd11;
  transition: border 0.2s, box-shadow 0.2s;
}

.template-card.selected {
  border: 2px solid #a259ff;
  box-shadow: 0 4px 16px #a259ff22;
}

.template-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.template-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  font-weight: 500;
}

.checkmark {
  color: #a259ff;
  font-size: 1.3em;
}

.color-customization {
  margin: 18px 0;
}

.color-swatches {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e0e7ff;
  cursor: pointer;
  transition: border 0.2s;
}

.swatch.active {
  border: 2px solid #a259ff;
  box-shadow: 0 2px 8px #a259ff44;
}

.custom-color {
  border: none;
  width: 32px;
  height: 32px;
  padding: 0;
  margin-left: 8px;
}

.design-options {
  display: flex;
  gap: 18px;
  margin: 18px 0;
}

.option-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #6a5acd11;
  padding: 16px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  transition: box-shadow 0.2s;
  border: 1px solid #e0e7ff;
}

.option-card:hover {
  box-shadow: 0 4px 16px #a259ff22;
  border: 1px solid #a259ff;
}

.option-card i {
  font-size: 1.3em;
  color: #a259ff;
  margin-bottom: 6px;
}

.option-desc {
  font-size: 0.95em;
  color: #888;
}

/* Step 4 Preview Styles */
.step4-container {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.preview-panel {
  flex: 2;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd11;
  padding: 24px;
  min-width: 400px;
}

.preview-title {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 18px;
}

.invitation-preview-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd22;
  border: 2px solid #a259ff;
  overflow: hidden;
  width: 340px;
  margin: 0 auto 32px;
  display: flex;
  flex-direction: column;
}

.preview-card-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.preview-card-content {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-label {
  background: #e0e7ff;
  color: #6a5acd;
  font-size: 0.9em;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 12px;
  margin-bottom: 8px;
}

.preview-title-main {
  font-size: 1.3em;
  font-weight: bold;
  color: #a259ff;
  margin-bottom: 8px;
}

.preview-details {
  font-size: 1em;
  color: #444;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
}

.preview-details i {
  margin-right: 6px;
}

.preview-desc {
  font-size: 0.98em;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}

.preview-host {
  font-size: 0.98em;
  color: #222;
  margin-bottom: 12px;
}

.preview-host span {
  color: #a259ff;
  font-weight: 600;
}

.preview-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}

.preview-qr img {
  width: 80px;
  height: 80px;
  border: 2px dashed #a259ff;
  border-radius: 8px;
  margin-bottom: 4px;
  background: #f8f9fd;
}

.qr-label {
  font-size: 0.95em;
  color: #888;
}

/* Guest Cards Preview */
.guest-cards-preview {
  margin-top: 24px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.guest-card-preview {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(106,90,205,0.1);
  padding: 16px;
  border: 1px solid #e0e7ff;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.card-type {
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 600;
}

.card-content h4 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
}

.card-event-info {
  margin-bottom: 12px;
  font-size: 0.9em;
}

.event-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.event-date {
  opacity: 0.8;
}

.card-qr {
  text-align: center;
}

.card-qr img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.more-cards {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 16px;
  background: #f8f9fd;
  border-radius: 8px;
}

/* Controls Panel */
.controls-panel {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd11;
  padding: 24px;
  min-width: 320px;
  max-height: fit-content;
}

.controls-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.controls-tabs button {
  background: none;
  border: none;
  color: #888;
  font-weight: 600;
  font-size: 0.95em;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.controls-tabs button.active {
  color: #a259ff;
  background: #f8f9fd;
}

.controls-content {
  margin-bottom: 12px;
}

.controls-section {
  margin-bottom: 18px;
}

.controls-title {
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 12px;
  color: #444;
}

.template-images {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.template-images img {
  width: 50px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid #e0e7ff;
  cursor: pointer;
  transition: border 0.2s;
}

.template-images img.selected {
  border: 2px solid #a259ff;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e0e7ff;
  color: #6a5acd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9em;
  cursor: pointer;
  margin: 8px 0;
}

.layout-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.element-btn {
  background: #e0e7ff;
  color: #6a5acd;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
}

.element-btn.active {
  background: #6a5acd;
  color: #fff;
}

.align-btns,
.text-style-btns {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.align-btns button,
.text-style-btns button {
  background: #e0e7ff;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  color: #6a5acd;
  cursor: pointer;
  transition: background 0.2s;
}

.align-btns button.active,
.text-style-btns button.active {
  background: #6a5acd;
  color: #fff;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.card-modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(106,90,205,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e7ff;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.full-guest-card {
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(106,90,205,0.15);
  margin-bottom: 20px;
}

.full-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.invitation-label {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 600;
}

.guest-type {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8em;
  font-weight: 600;
}

.full-card-content {
  text-align: center;
}

.guest-name {
  font-size: 1.8em;
  font-weight: bold;
  margin: 0 0 20px 0;
}

.event-details h3 {
  font-size: 1.3em;
  margin: 0 0 16px 0;
}

.event-info {
  text-align: left;
  margin-bottom: 16px;
}

.event-info div {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-description {
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 16px;
  opacity: 0.9;
}

.host-info {
  font-size: 0.95em;
  margin-bottom: 20px;
}

.card-qr-section {
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 20px;
  margin-top: 20px;
}

.qr-code {
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
  border-radius: 8px;
}

.qr-instruction {
  font-size: 0.9em;
  opacity: 0.8;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.download-btn,
.send-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-btn {
  background: #e0e7ff;
  color: #6a5acd;
}

.download-btn:hover {
  background: #d1d5fa;
}

.send-btn {
  background: #6a5acd;
  color: #fff;
}

.send-btn:hover {
  background: #8f94fb;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.back-btn,
.continue-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn {
  background: #e0e7ff;
  color: #6a5acd;
}

.back-btn:hover {
  background: #d1d5fa;
}

.continue-btn {
  background: linear-gradient(90deg, #6a5acd 0%, #8f94fb 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(106,90,205,0.08);
}

.continue-btn:hover {
  background: linear-gradient(90deg, #8f94fb 0%, #6a5acd 100%);
  transform: translateY(-1px);
}

.advanced-options {
  margin: 24px 0;
}

.save-share {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 16px;
}

.save-btn,
.export-btn,
.share-btn {
  background: #fff;
  border: 1px solid #e0e7ff;
  color: #6a5acd;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn:hover,
.export-btn:hover,
.share-btn:hover {
  border-color: #a259ff;
  box-shadow: 0 2px 8px #a259ff22;
  transform: translateY(-1px);
}

/* Responsive Design */
/* Responsive Design */
@media (max-width: 1200px) {
  .form-card {
    padding: 24px;
  }
  
  .steps {
    padding: 24px 32px;
  }
  
  .steps::before {
    left: 70px;
    right: 70px;
  }
}

@media (max-width: 992px) {
  .create-invitation-page {
    margin: 16px;
    border-radius: 12px;
  }
  
  .top-header {
    padding: 20px 24px;
  }
  
  .steps {
    padding: 20px;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }
  
  .steps::before {
    display: none;
  }
  
  .step {
    flex: 0 0 calc(50% - 16px);
    margin-bottom: 16px;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .date-time-row,
  .organizer-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .design-options {
    flex-direction: column;
  }
  
  .step4-container {
    flex-direction: column;
  }
  
  .preview-panel,
  .controls-panel {
    width: 100%;
  }
  
  .guest-inputs {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .add-guest-btn {
    margin-top: 8px;
  }
}

@media (max-width: 768px) {
  .top-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .steps {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .step {
    flex: 0 0 100%;
    width: 100%;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .back-btn,
  .continue-btn {
    width: 100%;
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
  
  .col-checkbox,
  .col-actions {
    justify-self: center;
  }
  
  .save-share {
    flex-direction: column;
    gap: 12px;
  }
  
  .save-btn,
  .export-btn,
  .share-btn {
    width: 100%;
    justify-content: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .download-btn,
  .send-btn {
    width: 100%;
    justify-content: center;
  }
  
  .card-modal {
    width: 95%;
    margin: 16px;
  }
  
  .controls-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .color-swatches {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .create-invitation-page {
    margin: 8px;
    border-radius: 8px;
  }
  
  .top-header {
    padding: 16px;
  }
  
  .form-card {
    padding: 16px;
  }
  
  .steps {
    padding: 16px 8px;
  }
  
  .step {
    flex-direction: row;
    gap: 8px;
  }
  
  .step .circle {
    margin-bottom: 0;
    width: 28px;
    height: 28px;
    font-size: 0.9em;
  }
  
  .template-card img {
    height: 100px;
  }
  
  .template-footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .bulk-import {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .list-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .invitation-preview-card {
    width: 100%;
  }
  
  .full-card-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .event-info div {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}

/* High-resolution displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .invitation-preview-card,
  .full-guest-card {
    border-width: 0.5px;
  }
}

/* Print styles */
@media print {
  .top-header,
  .steps,
  .form-actions,
  .save-share,
  .back-btn {
    display: none !important;
  }
  
  .create-invitation-page {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }
  
  .form-card {
    box-shadow: none;
    padding: 0;
  }
  
  .invitation-preview-card,
  .full-guest-card {
    box-shadow: none;
    border: 1px solid #000;
    page-break-inside: avoid;
  }
}
</style>