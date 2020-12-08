import {Numbers} from "./Numbers";

export namespace Benchmark {

    export interface BenchmarkOpts {
        readonly count: number;
    }

    const defaultOpts: BenchmarkOpts = {
        count: 25
    }

    export async function exec(delegate: () => Promise<any>, opts: Partial<BenchmarkOpts> = defaultOpts) {

        const {count} = {
            ...defaultOpts,
            ...opts
        }

        let runtime = 0;

        const durations: number[] = [];

        for(const idx of Numbers.range(1, count)) {
            const before = Date.now();
            await delegate();
            const after = Date.now();
            const duration = after - before;
            console.log("duration: ", duration);
            runtime += duration;
            durations.push(duration);
        }

        const mean = runtime / count;
        const median = [...durations].sort()[Math.floor(durations.length / 2)];
        const max = Numbers.max(...durations);

        const percentile90 = [...durations].sort()[Math.floor(0.9 * durations.length)];

        console.log('=====')
        console.log("mean: " + mean);
        console.log("median: " + median);
        console.log("max: " + max);
        console.log("90th percentile: " + percentile90);

        // other stats like min, max, median, stddev, 90th percentile, etc

    }

}