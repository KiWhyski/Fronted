<script>
import SideNavbar from '@/public/components/side-navbar.vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, computed, onMounted } from 'vue'
import { ReportService } from '../services/report.service.js'

export default {
  name: 'reports-create-and-edit',
  components: { SideNavbar },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const isEdit = route.path.includes('/edit')

    const form = reactive({
      products: '',
      type: '',
      price: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    })

    const totalCost = computed(() => `S/. ${(form.price * form.amount).toFixed(2)}`)

    const loadReport = async () => {
      if (isEdit) {
        try {
          const report = await ReportService.getReportById(props.id)
          Object.assign(form, report)
        } catch (error) {
          console.error('Error loading report:', error)
          router.push('/reports')
        }
      }
    }

    const handleSubmit = async () => {
      try {
        if (isEdit) {
          await ReportService.updateReport(props.id, form)
        } else {
          await ReportService.createReport({
            ...form,
            id: props.id
          })
        }
        router.push('/reports')
      } catch (error) {
        console.error('Error saving report:', error)
      }
    }

    const cancel = () => {
      router.push('/reports')
    }

    onMounted(loadReport)

    return { form, totalCost, handleSubmit, cancel }
  }
}
</script>

<template>
  <div class="report-bg">
    <side-navbar />
    <div class="report-main">
      <h1 class="title">{{ $t('reports.page-title') }}</h1>

      <div class="report-nav">
        <button class="nav-btn">{{ $t('reports.nav-internal') }}</button>
        <button class="nav-btn active">{{ $t('reports.nav-loss') }}</button>
        <button class="nav-btn">{{ $t('reports.nav-resupplies') }}</button>
        <button class="nav-btn">{{ $t('reports.nav-conservation') }}</button>
      </div>

      <h2 class="subtitle">{{ $t('reports.form-title') }}</h2>

      <form @submit.prevent="handleSubmit" class="report-form">
        <div class="form-group">
          <label>{{ $t('reports.product-name') }}</label>
          <input v-model="form.products" required />
        </div>
        <div class="form-group">
          <label>{{ $t('reports.type') }}</label>
          <input v-model="form.type" required />
        </div>
        <div class="form-group">
          <label>{{ $t('reports.price') }}</label>
          <input type="number" v-model.number="form.price" required min="0" step="0.01" />
        </div>
        <div class="form-group">
          <label>{{ $t('reports.quantity') }}</label>
          <input type="number" v-model.number="form.amount" required min="1" />
        </div>
        <div class="form-group">
          <label>{{ $t('reports.date') }}</label>
          <input type="date" v-model="form.date" required />
        </div>
        <div class="form-group">
          <label>{{ $t('reports.total-cost') }}</label>
          <input :value="totalCost" readonly />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn save">{{ $t('reports.save') }}</button>
          <button type="button" class="btn cancel" @click="cancel">{{ $t('components.cancel') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.report-bg {
  display: flex;
  background: #ffffff;
  min-height: 100vh;
}
.report-main {
  flex: 1;
  padding: 2rem;
}
.title {
  font-size: 3rem;
  font-weight: bold;
  color: #6F0082;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}
.subtitle {
  color: #32312F;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-family: 'Inter Semi Bold', sans-serif;
}
.report-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  justify-content: space-between;
  font-family: 'Roboto', sans-serif;
}
.nav-btn {
  background: #fff;
  width: 31vh;
  height: 8vh;
  border: 2px solid #6E0081;
  padding: 0.3rem 2rem;
  border-radius: 28px;
  font-weight: bold;
  margin-left: 50px;
  font-size: 1.3rem;
}
.nav-btn.active,
.nav-btn:hover {
  background: #5A033A;
  color: white;
}
.subtitle {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
}
.report-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(38, 2, 29, 0.07);
  max-width: 600px;
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.btn {
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.save {
  background: #5A033A;
  color: white;
  border-radius: 28px;
}
.cancel {
  background: white;
  color: #6F0082;
  border-radius: 28px;
  border: 2px solid #6E0081;
}
</style>