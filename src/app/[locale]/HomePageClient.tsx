"use client";

import { Fragment, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Compass,
  Download,
  Droplets,
  ExternalLink,
  Flame,
  Gamepad2,
  Gift,
  Joystick,
  Lightbulb,
  Moon,
  Newspaper,
  PawPrint,
  Ship,
  Snowflake,
  Sparkles,
  Store,
  Target,
  Waves,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// M1: 平台 → 图标映射（3 个 distinct 图标）
const PLATFORM_ICON: Record<string, typeof Store> = {
  Steam: Store,
  Xbox: Gamepad2,
  PlayStation: Joystick,
};

// M4: 生物群系 → 图标映射（6 个 distinct 图标）
const BIOME_ICON: Record<string, typeof Ship> = {
  Bog: Droplets,
  Ocean: Waves,
  Arctic: Snowflake,
  Volcanic: Flame,
  Lunar: Moon,
  "Ascended Ocean Overhaul": Ship,
};

// M6: tier → badge 样式（S/A 实心→半透明梯度，Launch X-Creature 边框；全 nav-theme 无 hex）
const TIER_BADGE: Record<string, string> = {
  S: "bg-[hsl(var(--nav-theme))] text-white border border-transparent",
  A: "bg-[hsl(var(--nav-theme)/0.22)] text-[hsl(var(--nav-theme-light))] border border-[hsl(var(--nav-theme)/0.4)]",
  "Launch X-Creature":
    "bg-white/10 text-foreground border border-border",
};
const TIER_BADGE_FALLBACK =
  "bg-white/5 text-muted-foreground border border-border";

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void moduleLinkMap;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void locale;

  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.arkgenesisascendedpart1.wiki";

  // 工具卡 → section id 1:1 映射（与 en.json tools.cards 顺序一致，8 张卡）
  const TOOL_SECTION_IDS = [
    "ark-release-store",
    "ark-dlc-comparison",
    "ark-beginner-guide",
    "ark-map-biomes",
    "ark-missions-hexagons",
    "ark-creatures-taming",
    "ark-gear-weapons",
    "ark-patch-notes",
  ];

  // M6: 按 tier 分组（S → A → Launch X-Creature），每组保留原 items 顺序
  const creatureItems = t.modules.arkGenesisCreaturesAndTamingTierList.items;
  const CREATURE_TIERS = ["S", "A", "Launch X-Creature"]
    .map((tier) => ({
      tier,
      items: creatureItems.filter((it: any) => it.tier === tier),
    }))
    .filter((g) => g.items.length > 0);

  // M7: 按 category 分组（按 items 出现顺序去重）
  const gearItems = t.modules.arkGenesisGearWeaponsVehiclesAndStructures.items;
  const GEAR_CATEGORIES = gearItems
    .map((it: any) => it.category)
    .filter(
      (c: string, i: number, arr: string[]) => arr.indexOf(c) === i,
    );

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "ARK Genesis Ascended Part 1 Wiki",
        description:
          "Complete ARK Genesis Ascended Part 1 Wiki covering missions, biomes, taming, creatures, resources, bosses, ships, and download guides for ASA players on Steam, PS5 and Xbox.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "ARK Genesis Ascended Part 1 - Sci-fi Survival Sandbox",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "ARK Genesis Ascended Part 1 Wiki",
        alternateName: "ARK Genesis Ascended Part 1",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "ARK Genesis Ascended Part 1 Wiki - Missions, Biomes & Tames",
        },
        description:
          "Complete ARK Genesis Ascended Part 1 Wiki resource hub for missions, biomes, taming, creatures, resources, bosses, ships, and download guides.",
        sameAs: [
          "https://playark.com/",
          "https://store.steampowered.com/app/4558470/ARK_Genesis_Ascended_Part_1/",
          "https://discord.com/invite/playark",
          "https://www.reddit.com/r/ARK/",
          "https://www.youtube.com/survivetheark",
        ],
      },
      {
        "@type": "VideoGame",
        name: "ARK Genesis Ascended Part 1",
        gamePlatform: ["PC", "Steam", "PlayStation 5", "Xbox"],
        applicationCategory: "Game",
        genre: ["Survival", "Sandbox", "Adventure", "Sci-fi"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 8,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/4558470/ARK_Genesis_Ascended_Part_1/",
        },
      },
      {
        "@type": "VideoObject",
        name: "ARK: Genesis - Part 1 Expansion Pack!",
        description:
          "Official ARK: Survival Ascended - Genesis: Part 1 expansion pack reveal and gameplay trailer.",
        uploadDate: "2024-02-26",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/587ZD-y4LQE",
        url: "https://www.youtube.com/watch?v=587ZD-y4LQE",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://store.steampowered.com/app/4558470/ARK_Genesis_Ascended_Part_1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://playark.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域，桌面端 max-w-5xl 避免挤压广告 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="587ZD-y4LQE"
              title="ARK: Genesis - Part 1 Expansion Pack!"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 模块导航区（Hero → 视频 → 工具网格），4 卡 1:1 锚点 */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（保留模板的 Latest Updates 模块） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date, Platforms, and Store Links */}
      <section id="ark-release-store" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Store className="w-4 h-4" />
              {t.modules.arkGenesisReleaseDateAndStoreLinks.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisReleaseDateAndStoreLinks.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisReleaseDateAndStoreLinks.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisReleaseDateAndStoreLinks.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 scroll-reveal">
            {t.modules.arkGenesisReleaseDateAndStoreLinks.items.map(
              (item: any, index: number) => {
                const PlatformIcon = PLATFORM_ICON[item.platform] ?? Store;
                return (
                  <div
                    key={index}
                    className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl
                               hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg
                                   bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))]"
                      >
                        <PlatformIcon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base md:text-lg truncate">
                          {item.store}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                     text-[hsl(var(--nav-theme-light))]"
                        >
                          <Check className="w-3 h-3" />
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <dl className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Release</dt>
                        <dd className="font-medium text-right">{item.storeReleaseDate}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Price</dt>
                        <dd className="font-medium text-right">
                          <span className="inline-flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                            {item.price}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Requires</dt>
                        <dd className="font-medium text-right">{item.requiresBaseGame}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-muted-foreground">Playable on</dt>
                        <dd className="font-medium text-right">{item.playableOn.join(", ")}</dd>
                      </div>
                    </dl>

                    <ul className="space-y-1.5 mb-5 text-sm">
                      {item.keyFeatures.map((f: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5
                                 bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                                 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      {item.storeAction}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Free DLC vs Tides of Fortune Comparison */}
      <section
        id="ark-dlc-comparison"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Sparkles className="w-4 h-4" />
              {t.modules.arkGenesisFreeDlcAndTidesComparison.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisFreeDlcAndTidesComparison.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisFreeDlcAndTidesComparison.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisFreeDlcAndTidesComparison.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left p-3 md:p-4 font-semibold">Feature</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Genesis Ascended Part 1
                    <span className="block text-xs font-normal text-muted-foreground">Free DLC</span>
                  </th>
                  <th className="text-left p-3 md:p-4 font-semibold">
                    ARK Tides of Fortune
                    <span className="block text-xs font-normal text-muted-foreground">Paid Expansion</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.arkGenesisFreeDlcAndTidesComparison.items.map(
                  (item: any, index: number) => (
                    <Fragment key={index}>
                      <tr className="border-b border-border/60 align-top">
                        <td className="p-3 md:p-4 font-semibold">{item.row}</td>
                        <td className="p-3 md:p-4 text-muted-foreground">
                          {item.genesisAscendedPart1}
                        </td>
                        <td className="p-3 md:p-4 text-muted-foreground">
                          {item.arkTidesOfFortune}
                        </td>
                      </tr>
                      <tr className="bg-[hsl(var(--nav-theme)/0.04)]">
                        <td colSpan={3} className="p-3 md:p-4 text-xs md:text-sm">
                          <span className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item.playerTakeaway}</span>
                          </span>
                        </td>
                      </tr>
                    </Fragment>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="ark-beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Target className="w-4 h-4" />
              {t.modules.arkGenesisBeginnerGuide.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.arkGenesisBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl
                           hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex gap-3 md:gap-4">
                  <div
                    className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center
                               rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)]
                               bg-[hsl(var(--nav-theme)/0.2)]"
                  >
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-bold mb-2">
                      {step.title}
                    </h3>
                    <p className="flex items-start gap-2 text-sm md:text-base mb-3">
                      <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span>{step.goal}</span>
                    </p>
                    <ul className="space-y-1.5 mb-3 pl-1">
                      {step.actions.map((action: string, ai: number) => (
                        <li key={ai} className="flex items-start gap-2 text-sm md:text-base">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{action}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <p className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{step.beginnerTip}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Map Biomes and Ocean Overhaul */}
      <section
        id="ark-map-biomes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Waves className="w-4 h-4" />
              {t.modules.arkGenesisMapBiomesAndOceanOverhaul.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisMapBiomesAndOceanOverhaul.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisMapBiomesAndOceanOverhaul.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisMapBiomesAndOceanOverhaul.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.arkGenesisMapBiomesAndOceanOverhaul.items.map(
              (item: any, index: number) => {
                const BiomeIcon = BIOME_ICON[item.biome] ?? Waves;
                const isFeatured = index === t.modules.arkGenesisMapBiomesAndOceanOverhaul.items.length - 1;
                return (
                  <div
                    key={index}
                    className={`p-5 md:p-6 bg-white/5 border rounded-xl transition-colors
                                ${isFeatured
                                  ? "lg:col-span-3 border-[hsl(var(--nav-theme)/0.4)] bg-[hsl(var(--nav-theme)/0.04)]"
                                  : "border-border hover:border-[hsl(var(--nav-theme)/0.5)]"
                                }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg
                                   bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))]"
                      >
                        <BiomeIcon className="h-5 w-5" />
                      </span>
                      <h3 className="font-bold text-lg">{item.biome}</h3>
                    </div>

                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                      {item.officialDescription}
                    </p>

                    <div className="mb-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hazards
                      </p>
                      <ul className="space-y-1">
                        {item.hazards.map((h: string, hi: number) => (
                          <li key={hi} className="flex items-start gap-1.5 text-sm">
                            <span className="text-[hsl(var(--nav-theme-light))] mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                            <span className="text-muted-foreground">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Featured
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.featuredContent.map((c: string, ci: number) => (
                          <span
                            key={ci}
                            className="inline-flex items-center text-xs px-2 py-0.5 rounded-full
                                       bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground italic border-t border-border/60 pt-3">
                      {item.routeNote}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Missions, Hexagons, and Glitches */}
      <section id="ark-missions-hexagons" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Compass className="w-4 h-4" />
              {t.modules.arkGenesisMissionsHexagonsAndGlitches.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisMissionsHexagonsAndGlitches.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisMissionsHexagonsAndGlitches.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisMissionsHexagonsAndGlitches.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Activity</th>
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="text-left p-3 md:p-4 font-semibold">Objective</th>
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Difficulty</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Reward Loop
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.arkGenesisMissionsHexagonsAndGlitches.items.map(
                  (item: any, index: number) => (
                    <tr key={index} className="border-b border-border/60 align-top">
                      <td className="p-3 md:p-4 font-semibold whitespace-nowrap">
                        {item.activity}
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center text-xs px-2 py-0.5 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                     text-[hsl(var(--nav-theme-light))]"
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground">{item.objective}</td>
                      <td className="p-3 md:p-4 text-muted-foreground whitespace-nowrap">
                        {item.difficulty}
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground">{item.rewardLoop}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 广告位 5: 第五模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 6: Creatures and Taming Tier List */}
      <section
        id="ark-creatures-taming"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <PawPrint className="w-4 h-4" />
              {t.modules.arkGenesisCreaturesAndTamingTierList.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisCreaturesAndTamingTierList.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisCreaturesAndTamingTierList.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisCreaturesAndTamingTierList.intro}
            </p>
          </div>

          <div className="space-y-8 md:space-y-10 scroll-reveal">
            {CREATURE_TIERS.map((group) => (
              <div key={group.tier}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center text-xs md:text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      TIER_BADGE[group.tier] ?? TIER_BADGE_FALLBACK
                    }`}
                  >
                    {group.tier === "Launch X-Creature"
                      ? "Launch X-Creature"
                      : `Tier ${group.tier}`}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "creature" : "creatures"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col p-5 bg-white/5 border border-border rounded-xl
                                 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-lg leading-tight">{item.creature}</h3>
                        <span
                          className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            TIER_BADGE[item.tier] ?? TIER_BADGE_FALLBACK
                          }`}
                        >
                          {item.tier}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-3">
                        {item.role}
                      </p>
                      <ul className="space-y-1.5 text-sm mb-3">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold whitespace-nowrap">Movement:</span>
                          <span className="text-muted-foreground">{item.movement}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold whitespace-nowrap">Combat:</span>
                          <span className="text-muted-foreground">{item.combat}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold whitespace-nowrap">Base:</span>
                          <span className="text-muted-foreground">{item.baseUtility}</span>
                        </li>
                      </ul>
                      <p className="text-xs text-muted-foreground italic border-t border-border/60 pt-3 mt-auto">
                        {item.tamingPriority}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 第六模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 7: Gear, Weapons, Vehicles, and Structures */}
      <section id="ark-gear-weapons" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Wrench className="w-4 h-4" />
              {t.modules.arkGenesisGearWeaponsVehiclesAndStructures.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisGearWeaponsVehiclesAndStructures.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisGearWeaponsVehiclesAndStructures.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisGearWeaponsVehiclesAndStructures.intro}
            </p>
          </div>

          <div className="space-y-8 md:space-y-10 scroll-reveal">
            {GEAR_CATEGORIES.map((category: string) => {
              const categoryItems = gearItems.filter((it: any) => it.category === category);
              return (
                <div key={category}>
                  <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold mb-4">
                    <span className="inline-block w-1.5 h-6 rounded bg-[hsl(var(--nav-theme))]" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-col p-5 bg-white/5 border border-border rounded-xl
                                   hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-bold text-base">{item.item}</h4>
                          <span
                            className="inline-flex items-center text-xs px-2 py-0.5 rounded-full whitespace-nowrap
                                       bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                       text-[hsl(var(--nav-theme-light))]"
                          >
                            {item.displayTag}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{item.useCase}</p>
                        <p className="text-xs text-muted-foreground mt-auto">
                          <span className="font-semibold text-foreground/80">Best for: </span>
                          {item.bestFor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 7: 第七模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 8: Patch Notes, Servers, and System Requirements */}
      <section
        id="ark-patch-notes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                            text-xs md:text-sm font-medium text-[hsl(var(--nav-theme-light))]"
            >
              <Newspaper className="w-4 h-4" />
              {t.modules.arkGenesisPatchNotesServersAndSystemRequirements.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.arkGenesisPatchNotesServersAndSystemRequirements.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              {t.modules.arkGenesisPatchNotesServersAndSystemRequirements.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.arkGenesisPatchNotesServersAndSystemRequirements.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Date</th>
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Version</th>
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Platform</th>
                  <th className="text-left p-3 md:p-4 font-semibold whitespace-nowrap">Category</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                    Player Impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.arkGenesisPatchNotesServersAndSystemRequirements.items.map(
                  (item: any, index: number) => (
                    <tr key={index} className="border-b border-border/60 align-top">
                      <td className="p-3 md:p-4 font-semibold whitespace-nowrap">{item.date}</td>
                      <td className="p-3 md:p-4 text-muted-foreground whitespace-nowrap">
                        {item.version}
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground whitespace-nowrap">
                        {item.platform}
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center text-xs px-2 py-0.5 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                                     text-[hsl(var(--nav-theme-light))]"
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-muted-foreground">{item.playerImpact}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/playark"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/ARK/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/survivetheark"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://playark.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.officialSite}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
