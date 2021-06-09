import { boot } from 'quasar/wrappers';

interface Observer {
    event: string;
    handler: (data?: Record<string, never>) => void;
}

export function createObserver() {
    const observers: Observer[] = [];

    function subscribe(key: string, handler: Observer['handler']) {
        observers.push({
            event: key,
            handler,
        });
    }

    function unsubscribe(handler: Observer['handler']) {
        const index = observers.findIndex((o) => o.handler === handler);
        if (index === -1) {
            return;
        }

        observers.splice(index, 1);
    }

    function notifyAll(event: string, data?: Record<string, never>) {
        observers
            .filter((o) => o.event === event || o.event === '*')
            .forEach((o) => {
                if (o.handler) {
                    o.handler(data);
                }
            });
    }

    return {
        observers,
        subscribe,
        unsubscribe,
        notifyAll,
    };
}

const events = createObserver();

const useEvents = () => events;

export default boot(({ app }) => {
    app.config.globalProperties.$events = events;
});

export { useEvents };
