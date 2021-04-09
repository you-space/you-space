import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import { messages, dateTimeFormats } from 'src/i18n';

const i18n = createI18n({
    locale: 'en-US',
    messages,
    datetimeFormats: dateTimeFormats,
    fallbackLocal: 'en-US',
});

export default boot(({ app }) => {
    // Set i18n instance on app
    app.use(i18n);
});

export { i18n };
