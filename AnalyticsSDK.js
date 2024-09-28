// Implement an analytics SDK that exposes log events, it takes in events and queues them, and then starts sending the events.

// Send each event after a delay of 1 second and this logging fails every n % 5 times.
// Send the next event only after the previous one resolves.
// When the failure occurs attempt a retry.

class AnalyticsSDk {
  constructor() {
    this.queue = [];
    this.sending = false;
    this.failCount = 1;
    this.maxFailLimit = 5;
  }

  logEvent(event) {
    this.queue.push(event);
    if (!this.sending) {
      this.startSending();
    }
  }

  async sendEvent(event) {
    if (this.failCount % this.maxFailLimit == 0 && this.failCount !== 0) {
      this.failCount++;
      throw new Error('Failed');
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Event sent', event);
    this.failCount++;
  }

  async startSending() {
    this.sending = true;
    while (this.queue.length > 0) {
      const event = this.queue[0];
      try {
        await this.sendEvent(event);
        this.queue.shift();
      } catch (error) {
        console.log('Failed');
        await this.retry(event);
      }
    }
    this.sendEvent = false;
  }

  async retry(event) {
    console.log('Retry event', event);
    await this.sendEvent(event);
  }
}

const outputRequired = new AnalyticsSDk();

outputRequired.logEvent({ type: 'click', value: 'buttonA' });
outputRequired.logEvent({ type: 'click', value: 'buttonB' });
outputRequired.logEvent({ type: 'click', value: 'buttonC' });
outputRequired.logEvent({ type: 'click', value: 'buttonD' });
outputRequired.logEvent({ type: 'click', value: 'page1' });
outputRequired.logEvent({ type: 'click', value: 'buttonE' });
