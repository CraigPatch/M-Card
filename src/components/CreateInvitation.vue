<template>
  <div class="create-invitation-page">
    <header class="top-header">
      <!-- <h2>Create Invitation</h2> -->
      <!-- <div class="user-info">
        <span class="bell-icon">🔔</span>
        <span class="user-avatar"><i class="fas fa-user"></i></span>
        <span class="user-name">John Doe</span>
      </div> -->
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

      <!-- Step 3: Preview & Finalize -->
      <form v-if="step === 3" @submit.prevent="submitInvitation">
        <h3 class="step-title">Preview & Finalize</h3>
        <div class="step3-container">
          <div class="preview-panel">
            <div class="preview-title">Invitation Preview</div>
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
          </div>
          <div class="controls-panel step3-controls">
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
                  <input type="checkbox" v-model="form.showQR" /> Show QR Code
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
            <button type="button" class="export-btn">Export Design</button>
            <button type="button" class="share-btn">Share Preview</button>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="back-btn" @click="prevStep">Back</button>
          <button type="submit" class="continue-btn">Create Invitation <span>→</span></button>
        </div>
      </form>
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
      templates: [
        { id: 1, name: 'Elegant Template', image: 'https://images.unsplash.com/photo-1515165562835-cf7747d3f1c2?auto=format&fit=crop&w=800&q=80' },
        { id: 2, name: 'Modern Template', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
        { id: 3, name: 'Festive Template', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80' },
        { id: 4, name: 'Corporate Template', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }
      ],
      colors: ['#6a5acd', '#22c55e', '#f59e42', '#f43f5e', '#a259ff', '#222', '#fff', '#000'],
      layouts: ['Classic', 'Modern', 'Minimal', 'Futuristic'],
      activeTab: 'design'
    };
  },
  computed: {
    selectedTemplate() {
      return this.templates.find(t => t.id === this.form.templateId) || this.templates[0];
    },
    qrCodeUrl() {
      return `https://api.qrserver.com/v1/create-qr-code/?size=${this.form.qrSize}x${this.form.qrSize}&data=RSVP`;
    }
  },
  methods: {
    prevStep() {
      if (this.step > 1) this.step--;
    },
    nextStep() {
      if (this.step < 3) this.step++;
    },
    submitInvitation() {
      alert('Invitation created!');
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
      localStorage.setItem('invitationDraft', JSON.stringify(this.form));
      alert('Draft saved! You can continue later.');
    }
  },
  mounted() {
    const draft = localStorage.getItem('invitationDraft');
    if (draft) {
      this.form = { ...this.form, ...JSON.parse(draft) };
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

.top-header h2 {
  font-size: 1.6em;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bell-icon {
  font-size: 1.2em;
  color: #6a5acd;
}

.user-avatar {
  background: #e0e7ff;
  border-radius: 50%;
  padding: 6px;
  font-size: 1.1em;
  color: #6a5acd;
}

.user-name {
  font-weight: 500;
  color: #444;
}

.steps {
  display: flex;
  gap: 48px;
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
  max-width: 900px;
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
.form-row textarea {
  padding: 10px 12px;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  font-size: 1em;
  background: #f8f9fd;
  transition: border 0.2s;
}

.form-row input:focus,
.form-row textarea:focus {
  border-color: #6a5acd;
  outline: none;
}

.date-time-row {
  display: flex;
  gap: 24px;
}

.date-time-row > div {
  flex: 1;
}

.organizer-row {
  display: flex;
  gap: 24px;
}

.organizer-row > div {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.back-btn {
  background: #e0e7ff;
  color: #6a5acd;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #d1d5fa;
}

.continue-btn {
  background: linear-gradient(90deg, #6a5acd 0%, #8f94fb 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(106,90,205,0.08);
  transition: background 0.2s, transform 0.2s;
}

.continue-btn:hover {
  background: linear-gradient(90deg, #8f94fb 0%, #6a5acd 100%);
  transform: scale(1.05);
}

.card-style-options {
  display: flex;
  gap: 24px;
  margin-bottom: 18px;
}
.card-style {
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
  text-align: center;
  width: 120px;
  box-shadow: 0 2px 8px #6a5acd11;
  background: rgba(255,255,255,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card-style.selected {
  border: 2px solid #6a5acd;
  box-shadow: 0 4px 16px #6a5acd22;
}
.card-style img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 6px;
}
.qr-positions {
  display: flex;
  gap: 18px;
  margin-bottom: 12px;
}
.card-preview {
  position: relative;
  width: 220px;
  height: 140px;
  margin: 0 auto;
}
.card-mockup {
  position: relative;
  width: 220px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px #6a5acd22;
  background: #fff;
}
.card-mockup img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
.card-mockup.light { border: 2px solid #e0e7ff; background: #fff; }
.card-mockup.dark { border: 2px solid #222; background: linear-gradient(135deg, #222 60%, #444 100%); }
.card-mockup.futuristic { border: 2px solid #6a5acd; background: linear-gradient(135deg, #6a5acd 60%, #8f94fb 100%); box-shadow: 0 0 24px #8f94fb88; }
.qr-mock {
  position: absolute;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  box-shadow: 0 2px 8px #6a5acd22;
  cursor: grab;
  transition: width 0.2s, height 0.2s, background 0.2s, left 0.2s, top 0.2s;
}
.qr-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
.manual-add {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.manual-add input {
  flex: 1;
}
.guest-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.guest-chip {
  background: #e0e7ff;
  color: #6a5acd;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 0.98em;
  display: flex;
  align-items: center;
  gap: 6px;
}
.guest-chip button {
  background: none;
  border: none;
  color: #6a5acd;
  font-size: 1.1em;
  cursor: pointer;
  margin-left: 4px;
}

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
  position: relative;
}
.template-card.selected {
  border: 2px solid #a259ff;
  box-shadow: 0 4px 16px #a259ff22;
}
.template-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}
.template-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  font-weight: 500;
  font-size: 1em;
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
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.back-btn, .continue-btn {
  background: #a259ff;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn {
  background: #e0e7ff;
  color: #a259ff;
}
.back-btn:hover {
  background: #d1d5fa;
}
.continue-btn:hover {
  background: #6a5acd;
}
.preview-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}
.preview-area {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
.invitation-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd22;
  border: 2px solid #a259ff;
  overflow: hidden;
  width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.card-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}
.card-content {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card-label {
  background: #e0e7ff;
  color: #6a5acd;
  font-size: 0.9em;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 12px;
  margin-bottom: 8px;
}
.card-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #a259ff;
  margin-bottom: 8px;
}
.card-details {
  font-size: 1em;
  color: #444;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
}
.card-details i {
  margin-right: 6px;
}
.card-desc {
  font-size: 0.98em;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}
.card-host {
  font-size: 0.98em;
  color: #222;
  margin-bottom: 12px;
}
.card-host span {
  color: #a259ff;
  font-weight: 600;
}
.card-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}
.card-qr img {
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
.design-controls {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd11;
  padding: 18px 24px;
  min-width: 0;
}
.tabs {
  display: flex;
  gap: 18px;
  margin-bottom: 16px;
}
.tabs button {
  background: none;
  border: none;
  color: #888;
  font-weight: 600;
  font-size: 1em;
  padding: 8px 18px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.tabs button.active {
  color: #a259ff;
  background: #f8f9fd;
}
.tab-content {
  margin-bottom: 12px;
}
.template-images {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.template-images img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
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
  background: #e0e7ff;
  color: #6a5acd;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.98em;
  cursor: pointer;
  margin-top: 8px;
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
.element-btn {
  background: #e0e7ff;
  color: #6a5acd;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.98em;
  margin-right: 8px;
}
.align-btns button,
.text-style-btns button {
  background: #e0e7ff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  margin-right: 6px;
  color: #6a5acd;
  font-size: 1.1em;
  cursor: pointer;
}
.advanced-options {
  margin: 24px 0 0 0;
}
.save-share {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}
.save-btn, .export-btn, .share-btn {
  background: #fff;
  border: 1px solid #e0e7ff;
  color: #6a5acd;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.save-btn:hover, .export-btn:hover, .share-btn:hover {
  border: 1px solid #a259ff;
  box-shadow: 0 2px 8px #a259ff22;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.back-btn, .continue-btn {
  background: #a259ff;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn {
  background: #e0e7ff;
  color: #a259ff;
}
.back-btn:hover {
  background: #d1d5fa;
}
.continue-btn:hover {
  background: #6a5acd;
}
.preview-finalize-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}
.preview-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd11;
  padding: 24px;
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
  margin: 0 auto;
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
.controls-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6a5acd11;
  padding: 24px;
  min-width: 0;
}
.controls-tabs {
  display: flex;
  gap: 18px;
  margin-bottom: 16px;
}
.controls-tabs button {
  background: none;
  border: none;
  color: #888;
  font-weight: 600;
  font-size: 1em;
  padding: 8px 18px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
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
.template-images {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.template-images img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
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
  background: #e0e7ff;
  color: #6a5acd;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.98em;
  cursor: pointer;
  margin-top: 8px;
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
.element-btn {
  background: #e0e7ff;
  color: #6a5acd;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.98em;
  margin-right: 8px;
}
.align-btns button,
.text-style-btns button {
  background: #e0e7ff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  margin-right: 6px;
  color: #6a5acd;
  font-size: 1.1em;
  cursor: pointer;
}
.advanced-options {
  margin: 24px 0 0 0;
}
.save-share {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}
.save-btn, .export-btn, .share-btn {
  background: #fff;
  border: 1px solid #e0e7ff;
  color: #6a5acd;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.save-btn:hover, .export-btn:hover, .share-btn:hover {
  border: 1px solid #a259ff;
  box-shadow: 0 2px 8px #a259ff22;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.back-btn, .continue-btn {
  background: #a259ff;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn {
  background: #e0e7ff;
  color: #a259ff;
}
.back-btn:hover {
  background: #d1d5fa;
}
.continue-btn:hover {
  background: #6a5acd;
}
.step3-container {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.step3-controls {
  min-width: 320px;
  max-width: 420px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
@media (max-width: 900px) {
  .form-card {
    padding: 24px 12px 18px 12px;
    max-width: 98vw;
  }
  .top-header {
    padding: 24px 12px 0 12px;
  }
  .steps {
    margin-left: 12px;
    gap: 24px;
  }
  .organizer-row, .date-time-row {
    flex-direction: column;
    gap: 12px;
  }
  .design-grid { grid-template-columns: 1fr; gap: 18px; }
  .card-preview { margin: 0; }
  .template-grid { grid-template-columns: 1fr; }
  .design-options { flex-direction: column; gap: 12px; }
  .preview-grid { grid-template-columns: 1fr; gap: 18px; }
  .preview-area { min-height: 0; }
  .design-controls { margin-top: 18px; }
}

@media (max-width: 600px) {
  .form-card {
    padding: 12px 4px 12px 4px;
  }
  .top-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 16px 4px 0 4px;
  }
  .steps {
    gap: 12px;
    margin: 18px 0 12px 4px;
  }
}
</style>