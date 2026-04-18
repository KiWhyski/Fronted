<script>
export default {
  name: "report-item",
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete']
}
</script>

<template>
  <tr>
    <td>{{ report.products }}</td>
    <td>{{ report.type }}</td>
    <td>S/. {{ report.price.toFixed(2) }}</td>
    <td>{{ report.amount }}</td>
    <td>{{ report.date }}</td>
    <td>
      <button class="action-btn edit" @click="$emit('edit', report.id)">
        <i class="pi pi-pencil"></i>
      </button>
      <button class="action-btn delete" @click="$emit('delete', report.id)">
        <i class="pi pi-trash"></i>
      </button>
    </td>
  </tr>
</template>

<style scoped>
.action-btn {
  border: none;
  padding: 0.4rem 0.8rem;
  margin-right: 0.4rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit {
  background: #5A033A;
  color: white;
}

.edit:hover {
  background: #4a032a;
}

.delete {
  background: #dc3545;
  color: white;
}

.delete:hover {
  background: #c82333;
}

tr:hover {
  background-color: #f8f9fa;
}
</style>