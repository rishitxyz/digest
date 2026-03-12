export interface FeedItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  description: string;
  image: string;
  isRead: boolean;
  isFavorite: boolean;
}

export const mockFeedItems: FeedItem[] = [
  {
    id: '1',
    title: 'The Future of AI-Designed Interfaces',
    source: 'The Verge',
    timestamp: '2 hours ago',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    image: 'https://picsum.photos/seed/ai-design/600/400',
    isRead: false,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Material 3 Expressive: What Designers Need to Know',
    source: 'Google Design Blog',
    timestamp: '4 hours ago',
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    image: 'https://picsum.photos/seed/material3/600/400',
    isRead: false,
    isFavorite: false,
  },
  {
    id: '3',
    title: 'React Native 0.83: Performance Gains and New APIs',
    source: 'React Native Blog',
    timestamp: '6 hours ago',
    description:
      'The latest release brings significant Hermes engine optimizations, a revamped bridgeless architecture, and new animation primitives.',
    image: 'https://picsum.photos/seed/rn-perf/600/400',
    isRead: true,
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Why Indie Hacking Is Having a Renaissance',
    source: 'Hacker News',
    timestamp: '8 hours ago',
    description:
      'Solo developers are building profitable micro-SaaS products faster than ever, fueled by better tooling and the AI coding assistant revolution.',
    image: 'https://picsum.photos/seed/indie-hack/600/400',
    isRead: false,
    isFavorite: true,
  },
  {
    id: '5',
    title: 'TypeScript 6.0: The Pattern Matching Update',
    source: 'TypeScript Blog',
    timestamp: '12 hours ago',
    description:
      'The long-awaited pattern matching proposal finally lands in TypeScript, bringing Rust-like match expressions to the JavaScript ecosystem.',
    image: 'https://picsum.photos/seed/ts-6/600/400',
    isRead: true,
    isFavorite: false,
  },
  {
    id: '6',
    title: 'Building a Second Brain with RSS in 2026',
    source: 'Ness Labs',
    timestamp: '1 day ago',
    description:
      'In the age of algorithm-driven timelines, curating your own information diet through RSS feeds is the ultimate productivity hack.',
    image: 'https://picsum.photos/seed/second-brain/600/400',
    isRead: false,
    isFavorite: true,
  },
  {
    id: '7',
    title: 'Expo SDK 55: What\'s New for Mobile Developers',
    source: 'Expo Blog',
    timestamp: '1 day ago',
    description:
      'The newest Expo SDK introduces improved native module support, faster dev builds, and first-class web platform features.',
    image: 'https://picsum.photos/seed/expo-55/600/400',
    isRead: false,
    isFavorite: false,
  },
  {
    id: '8',
    title: 'The Death of the Home Screen',
    source: 'Wired',
    timestamp: '2 days ago',
    description:
      'App launchers and home screens as we know them are being replaced by intelligent, context-aware task surfaces that anticipate your needs.',
    image: 'https://picsum.photos/seed/home-screen/600/400',
    isRead: true,
    isFavorite: false,
  },
  {
    id: '9',
    title: 'Dark Mode Done Right: Beyond Inverting Colors',
    source: 'Smashing Magazine',
    timestamp: '2 days ago',
    description:
      'A deep dive into how to build dark themes that respect the M3 tonal system, preserve contrast ratios, and feel intentionally crafted.',
    image: 'https://picsum.photos/seed/dark-mode/600/400',
    isRead: false,
    isFavorite: true,
  },
  {
    id: '10',
    title: 'Rust for Mobile: Is It Ready for Production?',
    source: 'InfoQ',
    timestamp: '3 days ago',
    description:
      'Exploring how Rust is being adopted in mobile development for performance-critical modules, bridging native and cross-platform worlds.',
    image: 'https://picsum.photos/seed/rust-mobile/600/400',
    isRead: true,
    isFavorite: false,
  },
];
