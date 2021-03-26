
<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card
          square
          bordered
          class="q-pa-lg shadow-1"
        >
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                v-model="emailOrUsername"
                square
                filled
                clearable
                label="username/email"
              />
              <q-input
                v-model="password"
                square
                filled
                clearable
                type="password"
                label="password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              :loading="loading"
              unelevated
              color="primary"
              size="lg"
              class="full-width"
              label="Login"
              @click="login"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
export default defineComponent({
    name: 'Login',
    data () {
        const store = useStore();
        const router = useRouter();

        const emailOrUsername = ref('');
        const password = ref('');
        const loading = ref(false);

        const login = async () => {
            loading.value = true;

            const request = await api.post('/login', {
                emailOrUsername: emailOrUsername.value,
                password: password.value
            }).catch(() => loading.value = false);

            const token = request.data.token;
            setTimeout(() => {
                loading.value = false;              
                store.commit('user/login', token);
  
                void router.push({
                    name: 'home'
                });

            }, 800);

        };

        return {
            emailOrUsername,
            password,
            login,
            loading
        };
    }
});
</script>