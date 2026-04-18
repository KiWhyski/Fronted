<script>
import { ref, reactive, onMounted } from 'vue';
import ProfileEdit from './profile-edit.component.vue';
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';

import PlanDetails from "@/profile-management/components/plan-details.component.vue";
import { useRouter } from 'vue-router';

export default {
  name: 'ProfileComponent',
  components: {
    PlanDetails,
    ToolbarContent,
    SideNavbar,
    ProfileEdit
  },
  setup() {
    const fileInput = ref(null);
    const router = useRouter();

    const goToPlanChange = () => {
      router.push('/plan-choose');
    };

    const userData = reactive({
      profileId: 0,
      name: '',
      email: '',
      role: '',
      businessName: '',
      businessAddress: '',
      phone: ''
    });

    const uploadNewPhoto = () => {
      console.log('Subir nueva foto');
      fileInput.value.click();
    };

    const onFileSelected = (event) => {
      const input = event.target;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        console.log('Archivo seleccionado:', file);

        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result;
          console.log('Imagen en base64:', base64Image);
        };
        reader.readAsDataURL(file);
      }
    };

    onMounted(async () => {
    });

    return {
      userData,
      fileInput,
      uploadNewPhoto,
      onFileSelected,
      goToPlanChange
    };
  },
};
</script>

<template>
  <div class="profile-page profile-page--apple dashboard-view--white">
    <SideNavbar>
      <ToolbarContent :pageTitle="$t('profile.title')" />
      <div class="profile-container">
        <div class="profile-stack">
          <div class="profile-columns">
            <div class="profile-col profile-col--main">
              <p class="apple-section-label">Profile</p>
              <div class="user-card apple-elevated">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="visually-hidden"
                  @change="onFileSelected"
                />
                <div class="avatar-wrap">
                  <div class="avatar" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="user-info">
                  <h2 class="user-name">{{ userData.name }}</h2>
                  <p class="user-email">{{ userData.email }}</p>
                  <button type="button" class="upload apple-btn apple-btn--primary" @click="uploadNewPhoto">
                    Choose photo
                  </button>
                </div>
              </div>

              <ProfileEdit />
            </div>

            <aside class="profile-col profile-col--aside">
              <p class="apple-section-label">Account</p>
              <section class="account-type">
                <div class="account-box apple-elevated">
                  <div class="account-info">
                    <div class="account-row">
                      <span class="account-label">Role</span>
                      <span class="account-value">{{ userData.role }}</span>
                    </div>
                    <div class="account-row account-row--bordered">
                      <span class="account-label">Current plan</span>
                      <span class="account-value">Free</span>
                    </div>
                  </div>
                  <button type="button" class="change-plan-link" @click.prevent="goToPlanChange">
                    Change plan
                    <i class="pi pi-chevron-right" aria-hidden="true"></i>
                  </button>
                </div>
              </section>

              <p class="apple-section-label">Plans</p>
              <PlanDetails />
            </aside>
          </div>
        </div>
      </div>
    </SideNavbar>
  </div>
</template>

<style scoped>
.profile-page {
  --apple-bg: #ffffff;
  --apple-card: #ffffff;
  --apple-label: rgba(60, 60, 67, 0.6);
  --apple-text: #1d1d1f;
  --apple-blue: #007aff;
  --apple-separator: rgba(60, 60, 67, 0.12);
  --apple-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  width: 100%;
  min-height: 100vh;
  font-family: var(--apple-font);
}

.profile-page--apple.dashboard-view--white :deep(.custom-toolbar) {
  background-color: var(--apple-bg) !important;
  border-bottom: 1px solid var(--apple-separator) !important;
}

.profile-page--apple.dashboard-view--white :deep(.toolbar-title) {
  background-color: transparent !important;
  color: var(--apple-text) !important;
  font-size: 1.375rem !important;
  font-weight: 600 !important;
  letter-spacing: -0.02em !important;
  padding-left: 1.25rem !important;
  line-height: 1.2 !important;
}

.profile-page--apple.dashboard-view--white :deep(main.content) {
  background-color: var(--apple-bg);
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  background-color: var(--apple-bg);
  min-height: 100vh;
  padding: 1.25rem 1rem 2.5rem;
  width: 100%;
  box-sizing: border-box;
}

.profile-stack {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
  width: 100%;
}

.profile-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-col .apple-section-label:first-child {
  margin-top: 0.25rem;
}

.profile-col--aside :deep(.plans--apple.plans-container) {
  max-width: none;
}

@media (max-width: 900px) {
  .profile-columns {
    grid-template-columns: 1fr;
  }

  .profile-col--aside .apple-section-label:first-child {
    margin-top: 1.5rem;
  }
}

.apple-section-label {
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--apple-label);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 1.25rem 0 0.375rem 0.25rem;
}

.apple-elevated {
  background: var(--apple-card);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.user-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.25rem 1.25rem;
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(180deg, #e8e8ed 0%, #d1d1d6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(60, 60, 67, 0.45);
}

.avatar svg {
  width: 44px;
  height: 44px;
}

.user-info {
  flex: 1;
  min-width: 0;
  text-align: left;
  margin: 0;
}

.user-name {
  margin: 0 0 0.25rem 0;
  color: var(--apple-text);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.user-email {
  margin: 0 0 0.75rem 0;
  color: var(--apple-label);
  font-size: 0.9375rem;
  line-height: 1.35;
}

.apple-btn {
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.5rem 0.95rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.apple-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.apple-btn--primary {
  background: var(--apple-blue);
  color: #fff;
}

.upload:hover {
  filter: brightness(1.05);
}

.account-type {
  width: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
}

.account-box {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.account-info {
  padding: 0.25rem 0 0;
}

.account-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  font-size: 1.0625rem;
}

.account-row--bordered {
  border-top: 1px solid var(--apple-separator);
}

.account-label {
  color: var(--apple-text);
  flex-shrink: 0;
}

.account-value {
  color: var(--apple-label);
  text-align: right;
  word-break: break-word;
}

.change-plan-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 1rem;
  margin: 0;
  border: none;
  border-top: 1px solid var(--apple-separator);
  background: transparent;
  color: var(--apple-blue);
  font-size: 1.0625rem;
  font-weight: 400;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
}

.change-plan-link .pi {
  font-size: 0.75rem;
  color: rgba(60, 60, 67, 0.35);
}

.change-plan-link:hover {
  background: rgba(0, 0, 0, 0.02);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1024px) {
  .user-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    width: 100%;
  }
}
</style>
