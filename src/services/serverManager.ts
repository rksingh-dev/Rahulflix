export type ServerType =
  | '111movies'
  | 'rivestream'
  | 'streamingnow'
  | 'vidbinge'
  | 'vembed'
  | 'rivestreamembed';

export interface ServerDefinition {
  id: ServerType;
  label: string;
  activeDomain: string;
  domains: string[];
  moviePattern: string;
  tvPattern: string;
  requiresTt?: boolean;
  openInNewTab?: boolean;
}

export interface ServersRegistry {
  version: number;
  updatedAt: string;
  servers: ServerDefinition[];
}

const STORAGE_KEY = 'rahulflix_server_registry_v2';
const REMOTE_CONFIG_URL =
  'https://raw.githubusercontent.com/rksingh-dev/Rahulflix/main/public/servers.json';
const LOCAL_CONFIG_URL = '/servers.json';

const DEFAULT_SERVERS: ServerDefinition[] = [
  {
    id: '111movies',
    label: 'SERVER 1 (Recommended)',
    activeDomain: 'https://111movies.net',
    domains: ['https://111movies.net', 'https://111movies.com'],
    moviePattern: '{domain}/movie/{id}',
    tvPattern: '{domain}/tv/{id}/{season}/{episode}',
    requiresTt: false,
  },
  {
    id: 'rivestream',
    label: 'SERVER 2 (Fast Stream)',
    activeDomain: 'https://multiembed.mov',
    domains: ['https://multiembed.mov', 'https://superembed.stream'],
    moviePattern: '{domain}/?video_id={id}',
    tvPattern: '{domain}/?video_id={id}&season={season}&episode={episode}',
    requiresTt: true,
    openInNewTab: true,
  },
  {
    id: 'streamingnow',
    label: 'SERVER 3 (HD Quality)',
    activeDomain: 'https://vidsrc.su',
    domains: [
      'https://vidsrc.su',
      'https://vidsrc.pm',
      'https://vidsrc.cc',
      'https://vidsrc.to',
      'https://vidsrc.xyz',
      'https://vidsrc.me',
    ],
    moviePattern: '{domain}/embed/movie/{id}',
    tvPattern: '{domain}/embed/tv/{id}/{season}/{episode}',
    requiresTt: true,
  },
  {
    id: 'vidbinge',
    label: 'SERVER 4 (Multi-Source)',
    activeDomain: 'https://vidsrc.pm',
    domains: ['https://vidsrc.pm', 'https://vidsrc.su', 'https://vidsrc.vip'],
    moviePattern: '{domain}/embed/movie/{id}',
    tvPattern: '{domain}/embed/tv/{id}/{season}/{episode}',
    requiresTt: true,
  },
  {
    id: 'vembed',
    label: 'SERVER 5 (Ultra Fast)',
    activeDomain: 'https://autoembed.co',
    domains: ['https://autoembed.co', 'https://player.autoembed.cc'],
    moviePattern: '{domain}/movie/imdb/{id}',
    tvPattern: '{domain}/tv/imdb/{id}-{season}-{episode}',
    requiresTt: true,
  },
  {
    id: 'rivestreamembed',
    label: 'SERVER 6 (Backup Stream)',
    activeDomain: 'https://www.2embed.cc',
    domains: ['https://www.2embed.cc', 'https://www.2embed.to', 'https://www.2embed.skin'],
    moviePattern: '{domain}/embed/{id}',
    tvPattern: '{domain}/embedtv/{id}&s={season}&e={episode}',
    requiresTt: true,
  },
];

class ServerManager {
  private servers: Map<ServerType, ServerDefinition> = new Map();
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.loadInitialState();
    this.init();
  }

  private loadInitialState(): void {
    // 1. Load built-in defaults
    DEFAULT_SERVERS.forEach((server) => {
      this.servers.set(server.id, { ...server });
    });

    // 2. Hydrate from localStorage if available
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ServersRegistry = JSON.parse(stored);
        if (Array.isArray(parsed.servers)) {
          parsed.servers.forEach((server) => {
            if (this.servers.has(server.id)) {
              this.servers.set(server.id, { ...this.servers.get(server.id)!, ...server });
            }
          });
        }
      }
    } catch (err) {
      console.warn('Could not load cached server registry:', err);
    }
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Attempt fetching from remote GitHub raw config, then fallback to local /servers.json
      const cacheBuster = `?ts=${Date.now()}`;
      let response: Response | null = null;

      try {
        response = await fetch(`${REMOTE_CONFIG_URL}${cacheBuster}`, {
          cache: 'no-store',
        });
      } catch {
        // Network error reaching GitHub raw, try local endpoint
        response = null;
      }

      if (!response || !response.ok) {
        response = await fetch(`${LOCAL_CONFIG_URL}${cacheBuster}`, {
          cache: 'no-store',
        });
      }

      if (response && response.ok) {
        const data: ServersRegistry = await response.json();
        if (Array.isArray(data.servers)) {
          let hasChanges = false;
          data.servers.forEach((incoming) => {
            const current = this.servers.get(incoming.id);
            if (current) {
              if (
                current.activeDomain !== incoming.activeDomain ||
                current.moviePattern !== incoming.moviePattern ||
                current.tvPattern !== incoming.tvPattern ||
                JSON.stringify(current.domains) !== JSON.stringify(incoming.domains)
              ) {
                hasChanges = true;
              }
              this.servers.set(incoming.id, { ...current, ...incoming });
            }
          });

          if (hasChanges) {
            this.saveToStorage();
            this.notifyListeners();
          }
        }
      }
    } catch (err) {
      console.warn('Auto-update of server endpoints skipped (offline or unreachable):', err);
    }
  }

  private saveToStorage(): void {
    try {
      const registry: ServersRegistry = {
        version: 2,
        updatedAt: new Date().toISOString(),
        servers: Array.from(this.servers.values()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
    } catch (e) {
      console.warn('Failed saving server registry to localStorage:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Error in server config listener:', e);
      }
    });
  }

  public getServerList(): ServerDefinition[] {
    return Array.from(this.servers.values());
  }

  public getServer(serverId: ServerType): ServerDefinition | undefined {
    return this.servers.get(serverId);
  }

  public getServerLabel(serverId: ServerType): string {
    const s = this.servers.get(serverId);
    return s?.label || `SERVER (${serverId})`;
  }

  public formatId(id: string, requiresTt: boolean): string {
    if (!id) return '';
    if (requiresTt) {
      return id.startsWith('tt') ? id : `tt${id}`;
    }
    // For servers that support numeric TMDB IDs or IMDb IDs:
    return id.startsWith('0') ? `tt${id}` : id;
  }

  public getStreamUrl(
    id: string,
    type: 'movie' | 'tv',
    season?: number,
    episode?: number,
    serverId: ServerType = '111movies'
  ): string {
    const server = this.servers.get(serverId) || this.servers.get('111movies')!;
    const formattedId = this.formatId(id, !!server.requiresTt);

    const pattern = type === 'movie' ? server.moviePattern : server.tvPattern;
    const finalSeason = season !== undefined ? season.toString() : '1';
    const finalEpisode = episode !== undefined ? episode.toString() : '1';

    return pattern
      .replace('{domain}', server.activeDomain)
      .replace('{id}', formattedId)
      .replace('{season}', finalSeason)
      .replace('{episode}', finalEpisode);
  }

  /**
   * When an iframe fails to load or domain is down, cycle through known mirrors of this server
   */
  public tryNextMirror(serverId: ServerType): { newDomain: string } | null {
    const server = this.servers.get(serverId);
    if (!server || !server.domains || server.domains.length <= 1) return null;

    const currentIndex = server.domains.indexOf(server.activeDomain);
    const nextIndex = (currentIndex + 1) % server.domains.length;

    // If we've looped through all mirrors, return null so it falls back to another server
    if (nextIndex === 0 && currentIndex !== -1) {
      return null;
    }

    const newDomain = server.domains[nextIndex];
    server.activeDomain = newDomain;
    this.saveToStorage();
    this.notifyListeners();

    return { newDomain };
  }

  /**
   * Smooth fallback chain to the next server if current server fails completely
   */
  public getNextFallbackServer(currentServer: ServerType): ServerType {
    const fallbackChain: ServerType[] = [
      '111movies',
      'streamingnow',
      'vidbinge',
      'vembed',
      'rivestreamembed',
      'rivestream',
    ];

    const idx = fallbackChain.indexOf(currentServer);
    if (idx === -1 || idx === fallbackChain.length - 1) {
      return fallbackChain[0];
    }
    return fallbackChain[idx + 1];
  }
}

export const serverManager = new ServerManager();
