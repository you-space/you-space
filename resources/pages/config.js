import space from 'space'

export default {
  template: `
        <y-page padding>            
            <div class='text-h4 text-bold q-mb-md'>Configurations</div>
            
            <y-form @submit='submit' class='row wrap'>
              <div class='col-12 q-mb-md' >
                <y-input v-model='config.siteName' :disable='loading' style='max-width:500px' label='Site name' filled />            
              </div>

              <div class='col-12 q-mb-md' >
                <y-toggle v-model='config.activePages' :disable='loading' val='space-jobs' label='Enable jobs page' />            
              </div>
              
              <div class='col-12 q-mb-md' >
                <y-toggle v-model='config.activePages' :disable='loading' val='space-types' label='Enable Types page' />            
              </div>

              <div class='col-12 q-mb-md' >
                <y-toggle v-model='config.activePages' :disable='loading' val='space-items-raw' label='Enable Items raw page' />            
              </div>
              
              <div class='col-12 q-mb-md' >
                <y-btn type='submit' label='Submit' :loading='saving' />            
              </div>
            </y-form>
            
        </y-page>
    `,
  setup() {
    const notify = vue.inject('notify')

    const loading = vue.ref(false)
    const saving = vue.ref(false)

    const config = vue.ref({
      siteName: '',
      activePages: [],
    })

    async function setConfig() {
      loading.value = true

      config.value = await space.emit('space:dashboard:config:get')

      setTimeout(() => {
        loading.value = false
      }, 800)
    }

    setConfig()

    async function submit() {
      try {
        saving.value = true

        await space.emit('space:dashboard:config:update', config.value)

        await setConfig()

        saving.value = false

        notify.create({
          type: 'positive',
          position: 'bottom-left',
          message: 'Configurations updated',
        })
      } catch (error) {
        console.error(error)

        saving.value = false

        notify.create({
          type: 'negative',
          position: 'bottom-left',
          message: 'Error on update configurations',
        })
      }
    }

    return {
      loading,
      saving,
      config,

      submit,
    }
  },
}
