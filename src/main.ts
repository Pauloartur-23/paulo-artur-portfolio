// O CSS global vem primeiro: ele declara a ordem das cascade layers antes dos estilos dos componentes
import './styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
