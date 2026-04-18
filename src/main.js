import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import { PrimeVue } from '@primevue/core';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Material from '@primeuix/themes/material';
import {createPinia} from "pinia";

const pinia = createPinia();

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { Form } from "@primevue/forms";

import {
    Button,
    Card,
    Checkbox,
    Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable, DatePicker,
    Dialog,
    DialogService,
    Drawer,
    FileUpload,
    FloatLabel,
    IconField,
    InputIcon,
    InputNumber,
    InputText,
    Menu,
    Menubar, Message, // ✅ Importado aquí
    Rating,
    Row,
    Select,
    Tag,
    Textarea,
    Toast,
    ToastService,
    Toolbar
} from "primevue";
import i18n from "./i18n/index.js";
import router from "./router/index.js";
import {useAuthenticationStore} from "@/authentication/services/authentication.store.js";

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App)
    .use(i18n)
    .use(pinia)
    .use(router)
    .use(vuetify)
    .use(PrimeVue, { theme: { preset: Material }, ripple: true })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox', Checkbox)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-select', Select)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-menubar', Menubar) // ✅ Registrado aquí
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-drawer', Drawer)
    .component('pv-tag', Tag)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)
    .component('pv-form', Form)
    .component('pv-message', Message)
    .component('pv-date-picker', DatePicker)
    .mount('#app')

const authenticationStore = useAuthenticationStore();
authenticationStore.initializeFromStorage();
