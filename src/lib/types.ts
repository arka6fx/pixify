export interface Thumbnail {
  id: string;
  prompt: string;
  style: StylePreset;
  imageUrl: string;
  createdAt: Date;
  isFavorite: boolean;
  aspectRatio: "16:9" | "9:16";
}

export type AssetType = "logo" | "icon" | "brand-kit" | "overlay" | "graphic";

export interface BrandAsset {
  id: string;
  name: string;
  type: AssetType;
  imageUrl: string;
  createdAt: Date;
  fileSize: number;
}

export interface CreatorAvatar {
  id: string;
  name: string;
  imageUrl: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalThumbnails: number;
  weeklyGenerations: number;
  storageUsed: number;
  totalAssets: number;
}

export type StylePreset =
  | "Cinematic"
  | "Minimal"
  | "Bold"
  | "Neon"
  | "Vintage"
  | "Clean"
  | "Dark"
  | "Vibrant"
  | "Retro"
  | "Gaming";

export const MOCK_STATS: DashboardStats = {
  totalThumbnails: 47,
  weeklyGenerations: 12,
  storageUsed: 256,
  totalAssets: 18,
};

export const MOCK_THUMBNAILS: Thumbnail[] = [
  {
    id: "gen-001",
    prompt: "Dark cinematic gaming thumbnail with RGB lighting and dramatic shadows",
    style: "Cinematic",
    imageUrl: "https://picsum.photos/seed/thumb1/960/540",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isFavorite: true,
    aspectRatio: "16:9",
  },
  {
    id: "gen-002",
    prompt: "Minimal tech review thumbnail with product shot",
    style: "Minimal",
    imageUrl: "https://picsum.photos/seed/thumb2/960/540",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "16:9",
  },
  {
    id: "gen-003",
    prompt: "Bold gaming montage with orange and cyan accents",
    style: "Bold",
    imageUrl: "https://picsum.photos/seed/thumb3/960/540",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isFavorite: true,
    aspectRatio: "16:9",
  },
  {
    id: "gen-004",
    prompt: "Neon synthwave thumbnail with retro grid background",
    style: "Neon",
    imageUrl: "https://picsum.photos/seed/thumb4/960/540",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "9:16",
  },
  {
    id: "gen-005",
    prompt: "Vintage film-style travel vlog thumbnail",
    style: "Vintage",
    imageUrl: "https://picsum.photos/seed/thumb5/960/540",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isFavorite: true,
    aspectRatio: "16:9",
  },
  {
    id: "gen-006",
    prompt: "Clean makeup tutorial thumbnail with soft pink theme",
    style: "Clean",
    imageUrl: "https://picsum.photos/seed/thumb6/960/540",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "9:16",
  },
  {
    id: "gen-007",
    prompt: "Dark horror game thumbnail with fog and shadows",
    style: "Dark",
    imageUrl: "https://picsum.photos/seed/thumb7/960/540",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    isFavorite: true,
    aspectRatio: "16:9",
  },
  {
    id: "gen-008",
    prompt: "Vibrant food review with overhead flat lay composition",
    style: "Vibrant",
    imageUrl: "https://picsum.photos/seed/thumb8/960/540",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "16:9",
  },
  {
    id: "gen-009",
    prompt: "Retro 80s style fitness challenge thumbnail",
    style: "Retro",
    imageUrl: "https://picsum.photos/seed/thumb9/960/540",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "16:9",
  },
  {
    id: "gen-010",
    prompt: "Gaming highlight reel thumbnail with motion blur effects",
    style: "Gaming",
    imageUrl: "https://picsum.photos/seed/thumb10/960/540",
    createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    isFavorite: true,
    aspectRatio: "16:9",
  },
  {
    id: "gen-011",
    prompt: "Cinematic movie review with dramatic lighting",
    style: "Cinematic",
    imageUrl: "https://picsum.photos/seed/thumb11/960/540",
    createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "16:9",
  },
  {
    id: "gen-012",
    prompt: "Minimal productivity setup with clean composition",
    style: "Minimal",
    imageUrl: "https://picsum.photos/seed/thumb12/960/540",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isFavorite: false,
    aspectRatio: "16:9",
  },
];

export const MOCK_ASSETS: BrandAsset[] = [
  {
    id: "asset-001",
    name: "Primary Logo",
    type: "logo",
    imageUrl: "https://picsum.photos/seed/asset1/200/200",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    fileSize: 245,
  },
  {
    id: "asset-002",
    name: "Channel Icon",
    type: "icon",
    imageUrl: "https://picsum.photos/seed/asset2/200/200",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    fileSize: 128,
  },
  {
    id: "asset-003",
    name: "Brand Kit 2024",
    type: "brand-kit",
    imageUrl: "https://picsum.photos/seed/asset3/200/200",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    fileSize: 2048,
  },
  {
    id: "asset-004",
    name: "Gradient Overlay",
    type: "overlay",
    imageUrl: "https://picsum.photos/seed/asset4/200/200",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    fileSize: 512,
  },
  {
    id: "asset-005",
    name: "Custom Frame",
    type: "overlay",
    imageUrl: "https://picsum.photos/seed/asset5/200/200",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    fileSize: 380,
  },
  {
    id: "asset-006",
    name: "Starter Pack",
    type: "graphic",
    imageUrl: "https://picsum.photos/seed/asset6/200/200",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    fileSize: 1024,
  },
];

export const MOCK_AVATARS: CreatorAvatar[] = [
  {
    id: "avatar-001",
    name: "Main Avatar",
    imageUrl: "https://picsum.photos/seed/avatar1/200/200",
    isDefault: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "avatar-002",
    name: "Gaming Profile",
    imageUrl: "https://picsum.photos/seed/avatar2/200/200",
    isDefault: false,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: "avatar-003",
    name: "Vlog Persona",
    imageUrl: "https://picsum.photos/seed/avatar3/200/200",
    isDefault: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "avatar-004",
    name: "Tech Setup",
    imageUrl: "https://picsum.photos/seed/avatar4/200/200",
    isDefault: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
];
