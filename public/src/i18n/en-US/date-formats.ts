import { IntlDateTimeFormat } from 'vue-i18n';
const formats: IntlDateTimeFormat = {
    // short: {
    //     year: 'numeric',
    //     month: 'short',
    //     day: 'numeric',
    // },
    long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
    },
};
export default formats;
