import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
    scenarios: {
        ramping_vus: { // Nama skenario
            executor: 'ramping-vus',  // Tipe executor
            startVUs: 1,                  // Mulai dengan 1 VU
            stages: [
                { duration: '10s', target: 50 },   // Meningkatkan jumlah VUs secara eksponensial selama 10 detik
                { duration: '15s', target: 250 },   // Meningkatkan jumlah VUs lebih tinggi selama 15 detik
                { duration: '20s', target: 750 },  // Meningkatkan jumlah VUs lebih tinggi selama 20 detik
                { duration: '10s', target: 0 },     // Mengurangi jumlah VUs kembali ke 0
            ]
        }
    }
};

function getAPI(){
    const res = http.get('http://test.k6.io');
    return res;
}

export default function () {
    const response = getAPI();
    check(response, {
        'Status is 200': (r) => r.status === 200,
        'Response time is less than 400ms': (r) => r.timings.duration < 400
    }); 
}

sleep(1);

export function handleSummary(data) {
    return {
        'reportscenariotest.html': htmlReport(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}