<script>
import SideNavbar from '@/public/components/side-navbar.vue'
import ReportList from '/src/analytics-and-reporting/components/report-list.component.vue'
import { Report } from '/src/analytics-and-reporting/model/report.entity.js'
import { ReportService } from '/src/analytics-and-reporting/services/report.service.js'
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: 'report-management',
  components: {
    ToolbarContent,
    SideNavbar,
    ReportList
  },
  data() {
    return {
      reports: [],
      loading: false,
      error: null
    }
  },
  mounted() {
    this.loadReports()
  },
  methods: {
    async loadReports() {
      this.loading = true
      this.error = null
      try {
        const data = await ReportService.getAllReports()
        this.reports = data.map(item => new Report(item))
      } catch (error) {
        this.error = this.$t('reports.load-error')
        console.error('Error loading reports:', error)
      } finally {
        this.loading = false
      }
    },
    generateReport() {
      const lastReport = this.reports[this.reports.length - 1]
      const newId = lastReport ? parseInt(lastReport.id) + 1 : 1
      this.$router.push({ name: 'report-create', params: { id: newId } })
    },
    editReport(id) {
      this.$router.push({ name: 'report-edit', params: { id } })
    },
    async deleteReport(id) {
      if (confirm('¿Estás seguro de eliminar este reporte?')) {
        try {
          await ReportService.deleteReport(id)
          await this.loadReports() // Recargar la lista después de eliminar
        } catch (error) {
          this.error = this.$t('reports.delete-error')
          console.error('Error deleting report:', error)
        }
      }
    },
    goToResupplies() {
      this.$router.push({ name: 'Resupplies' })
    }
  }
}
</script>

<template>
  <div class="report-bg">
    <side-navbar />
    <div class="report-main">
      <toolbar-content :pageTitle="$t('reports.title')"/>

      <div class="report-nav">
        <button class="nav-btn">{{ $t('reports.nav-internal') }}</button>
        <button class="nav-btn active">{{ $t('reports.nav-loss') }}</button>
        <button class="nav-btn" @click="goToResupplies">{{ $t('reports.nav-resupplies') }}</button>
      </div>

      <div class="report-subheader">
        <h2 class="subtitle">{{ $t('reports.subtitle-form') }}</h2>
        <button class="generate-btn" @click="generateReport">{{ $t('reports.generate') }}</button>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>{{ $t('reports.loading') }}</p>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadReports">Reintentar</button>
      </div>

      <report-list
          v-else
          :reports="reports"
          @edit="editReport"
          @delete="deleteReport"
      />
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
  font-family: 'Roboto', sans-serif;
}
.nav-btn.active,
.nav-btn:hover {
  background: #5A033A;
  color: white;
}
.report-subheader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.generate-btn,
.create-btn {
  background: #5A033A;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: bold;
  margin-top: 1rem;
}
.report-table th,
.report-table td {
  padding: 0.9rem 3rem;
  border-bottom: 1px solid #eee;
}
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  margin-top: 1rem;
}

.error-state {
  color: #dc3545;
}

.retry-btn {
  background: #5A033A;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
}

.retry-btn:hover {
  background: #4a032a;
}
</style>