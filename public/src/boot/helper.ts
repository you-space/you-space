import { i18n } from './i18n';
import { boot } from 'quasar/wrappers';

const rules = {
    required: (v?: string) =>
        (v && v.length > 0) || i18n.global.t('validation.rules.required'),
};

const helper = { rules };

export default boot(({ app }) => {
    app.config.globalProperties.$helper = helper;
});

export { helper };
