import { collectDefaultMetrics, Registry } from 'prom-client';
import { Router as createRouter } from 'express';

const registry = new Registry();

collectDefaultMetrics({
    register: registry,
});

export const prometheus = (config: { metricsPath: string }) => {
    const router = createRouter();
    router.get(config.metricsPath, (_, res) => res.send(registry.metrics()));
    return router;
};
