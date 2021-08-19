import { getVersion, sendableSteps } from 'prosemirror-collab';
import { Transaction, EditorState } from 'prosemirror-state';

export class CollabProvider implements CollabEditProvider {
  private eventEmitter: EventEmitter2 = new EventEmitter2();
  private channel: Channel;
  private queue: StepResponse[] = [];
  private config: Config;

  private getState = (): any => {};

  private participants: Map<string, Participant> = new Map();

  constructor(config: Config, pubSubClient: PubSubClient) {
    this.config = config;
    this.channel = new Channel(config, pubSubClient);
  }

  initialize(getState: () => any) {
    this.getState = getState;

    this.channel
      .on('connected', ({ doc, version }) => {
        logger(`Joined collab-session. The document version is ${version}`);
        const { userId } = this.config;

        this.emit('init', { sid: userId, doc, version }) // Set initial document
          .emit('connected', { sid: userId }); // Let the plugin know that we're connected an ready to go
      })
      .on('data', this.onReceiveData)
      .on('telepointer', this.onReceiveTelepointer)
      .connect();

    return this;
  }

  /**
   * Send steps from transaction to other participants
   */
  send(tr: Transaction, _oldState: EditorState, newState: EditorState) {
    // Ignore transactions without steps
    if (!tr.steps || !tr.steps.length) {
      return;
    }
    this.channel.sendSteps(newState, this.getState);
  }

  private onReceiveData = (data: StepResponse, forceApply?: boolean) => {
    const currentVersion = getVersion(this.getState());
    const expectedVersion = currentVersion + data.steps.length;

    if (data.version === currentVersion) {
      logger(`Received data we already have. Ignoring.`);
    } else if (data.version === expectedVersion) {
      this.processRemoteData(data, forceApply);
    } else if (data.version > expectedVersion) {
      logger(
        `Version too high. Expected ${expectedVersion} but got ${data.version}. Current local version is ${currentVersion}`,
      );
      this.queueData(data);
    }
  };
}